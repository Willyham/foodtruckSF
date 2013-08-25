<?php
class API{

    public static function getTruck($mongoClient, $id){
        $trucksCollection = $mongoClient->foodtrucks->trucks;
        $truck = $trucksCollection->findOne(array("_id" => new MongoId($id)));
        return APIUtils::flattenMongoID($truck);
    }

    public static function getTrucks($mongoClient){
        $trucksCollection = $mongoClient->foodtrucks->trucks;
        $truckCursor = new MongoScalarIDIterator( $trucksCollection->find() );
        $trucks = array();
        foreach($truckCursor as $truck){
            array_push($trucks, $truck);
        }
        return $trucks;
    }

    public static function getSchedule($mongoClient, $permit, $block, $lot){
        $scheduleCollection = $mongoClient->foodtrucks->schedules;
        $scheduleCursor = new MongoScalarIDIterator($scheduleCollection->find(array(
            'permit' => $permit,
            'block' => $block,
            'lot' => $lot
        )));
        $schedule = array();
        foreach($scheduleCursor as $scheduleItem){
            array_push($schedule, $scheduleItem);
        }
        return $schedule;
    }
}