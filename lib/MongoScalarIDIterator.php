<?php
class MongoScalarIDIterator extends IteratorIterator implements OuterIterator {

    function current(){
        return APIUtils::flattenMongoID($this->getInnerIterator()->current());
    }

}