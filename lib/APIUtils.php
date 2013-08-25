<?php
class APIUtils {

    public static function flattenMongoID(Array $mongoResult){
        if( $mongoResult['_id'] && get_class( $mongoResult['_id'] ) == 'MongoId' ){
            $mongoResult['_id'] = $mongoResult['_id']->{'$id'};
        }
        return $mongoResult;
    }
}