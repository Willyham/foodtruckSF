<?php
require 'vendor/autoload.php';

// Register autoloader for libs.
spl_autoload_register(function ($class) {
    include 'lib/' . $class . '.php';
});

try{
    $app = new \Slim\Slim(array(
        'debug' => true,
        'mongo' => array(
            'host' => 'localhost',
            'database' => 'foodtrucks'
        )
    ));

    $mongoConfig = $app->config('mongo');
    $mongoClient = new MongoClient(sprintf('mongodb://%s/%s', $mongoConfig['host'], $mongoConfig['database']));

    $app->get('/trucks', function() use($mongoClient) {
        try{
            echo json_encode(API::getTrucks($mongoClient));
        }
        catch (Exception $e){
            echo $e->getMessage();
        }
    });

    $app->get('/trucks/:id', function($id) use($mongoClient) {
        try{
            $truck = API::getTruck($mongoClient, $id);
            if(isset($truck['permit']) && isset($truck['block']) && isset($truck['lot'])){
                $truck['schedule'] = API::getSchedule($mongoClient, $truck['permit'], $truck['block'], $truck['lot']);
            }
            echo json_encode($truck);
        }
        catch (MongoException $e){
            // If we have a bad id then instantiating a MongoId throws an exception'.
            // return an empty set to the client.
            if($e->getCode() == 19){
                echo json_encode(array());
            }
        }
        catch (Exception $e){
            echo $e->getMessage();
        }
    });

    $app->get('/schedule/:permit:block:lot', function($permit, $block, $lot) use($mongoClient) {
        try{
            $schedule = API::getSchedule($mongoClient, $permit, $block, $lot);
            echo json_encode($schedule);
        }
        catch (Exception $e){
            echo $e->getMessage();
        }
    });

    $app->run();
}
catch (Exception $e){
    echo $e->getMessage();
}

