<?php
require 'vendor/autoload.php';
use Slim\Slim;

// Register autoloader for libs.
spl_autoload_register(function ($class) {
    include 'lib/' . $class . '.php';
});

try{
    // Create a new instance of Slim
    $app = new Slim(array(
        'debug' => true,
        'mongo' => array(
            'host' => 'localhost',
            'database' => 'foodtrucks'
        )
    ));

    // Establish our mongo connection
    $mongoConfig = $app->config('mongo');
    $mongoClient = new MongoClient(sprintf('mongodb://%s/%s', $mongoConfig['host'], $mongoConfig['database']));


    //region Trucks Endpoint
    /**
     * Define default 'trucks' route.
     * Returns all trucks, without schedule information
     */
    $app->get('/trucks', function() use($mongoClient) {
        $response = new APIResponse();
        try{
            $response->setData(API::getTrucks($mongoClient));
        }
        catch (Exception $e){
            $response->failWithException($e);
        }
        echo $response->toJSON();
    });

    /**
     * Define specific 'trucks' route.
     * Returns one truck including schedule information.
     */
    $app->get('/trucks/:id', function($id) use($mongoClient) {
        $response = new APIResponse();
        try{
            $truck = API::getTruck($mongoClient, $id);
            if(isset($truck['permit']) && isset($truck['block']) && isset($truck['lot'])){
                $truck['schedule'] = API::getSchedule($mongoClient, $truck['permit'], (int)$truck['block'], (int)$truck['lot']);
            }
            $response->setData($truck);
        }
        catch (MongoException $e){
            // If we have a bad id then instantiating a MongoId throws an exception.
            // return an empty set to the client in that case. Otherwise, it's a DB
            // problem we don't want to expose.
            if($e->getCode() != 19){
                $response->failWithException(new Exception("Internal error"));
            }
        }
        catch (Exception $e){
            $response->failWithException($e);
        }
        echo $response->toJSON();
    });
    //endregion

    //region Schedules Endpoint
    /**
     * Define 'schedules' route.
     * Get's all schedule information for a given truck,
     * The unique key for a truck is a composite of permit, block and lot.
     */
    $app->get('/schedules/:permit/:block/:lot', function($permit, $block, $lot) use($mongoClient) {
        $response = new APIResponse();
        try{
            $response->setData(API::getSchedule($mongoClient, $permit, $block, $lot));
        }
        catch (Exception $e){
            $response->failWithException($e);
        }
        echo $response->toJSON();
    });
    //endregion

    // Yipee ki-yay
    $app->run();
}
catch (Exception $e){
    echo $e->getMessage();
}
