<?php
require 'vendor/autoload.php';
require 'lib/APIUtils.php';

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

    $app->get('/trucks', function() use($app, $mongoClient) {
        try{
            $trucksCollection = $mongoClient->foodtrucks->trucks;
            $truckCursor = $trucksCollection->find()->limit(1);
            $trucks = array();
            while($truck = $truckCursor->getNext()){
                array_push($trucks, APIUtils::flattenMongoID($truck));
            }
            echo json_encode($trucks);
        }
        catch (Exception $e){
            echo $e->getMessage();
        }
    });

    $app->get('/trucks/:id', function($id) use($app, $mongoClient) {
        try{
            $trucksCollection = $mongoClient->foodtrucks->trucks;
            $truck = $trucksCollection->findOne(array("_id" => new MongoId($id)));
            $truck = APIUtils::flattenMongoID($truck);
            $truck['schedule'] = array('mock','mock2');
            echo json_encode($truck);
        }
        catch (Exception $e){
            echo $e->getMessage();
        }
    });

    $app->get('/schedule/:permit', function($permit) use($app, $mongoClient) {
        try{
            $scheduleCollection = $mongoClient->foodtrucks->schedules;
            $schedule = $scheduleCollection->findOne(array("permit" => $permit));
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

