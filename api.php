<?php
require 'vendor/autoload.php';

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
            $truckCursor = $trucksCollection->find();
            $trucks = array();
            while($truck = $truckCursor->getNext()){
                array_push($trucks, $truck);
            }
            echo json_encode($trucks);
        }
        catch (Exception $e){
            echo $e->getMessage();
        }
    });

    $app->get('/truck/:id', function($id) use($app, $mongoClient) {
        try{
            $trucksCollection = $mongoClient->foodtrucks->trucks;
            $truck = $trucksCollection->findOne(array("_id" => new MongoId($id)));
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

