<?php
class API{

    /**
     * Get a single truck.
     * @param MongoClient $mongoClient The mongodb client
     * @param String $id String representation of the mongo objectID
     * @return array
     */
    public static function getTruck($mongoClient, $id){
        $trucksCollection = $mongoClient->foodtrucks->trucks;
        $truck = $trucksCollection->findOne(array("_id" => new MongoId($id)));
        return APIUtils::flattenMongoID($truck);
    }

    /**
     * Get multiple trucks
     * @param MongoClient $mongoClient The mongodb client
     * @return array
     */
    public static function getTrucks($mongoClient){
        $trucksCollection = $mongoClient->foodtrucks->trucks;
        $truckCursor = new MongoScalarIDIterator( $trucksCollection->find() );
        $trucks = array();
        foreach($truckCursor as $truck){
            array_push($trucks, $truck);
        }
        return $trucks;
    }

    /**
     * Get schedule information
     * Schedule PK is (permit,block,lot).
     * @param MongoClient $mongoClient The mongodb client
     * @param String $permit The permit ID
     * @param Integer $block The block
     * @param Integer $lot The lot
     * @return array
     */
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