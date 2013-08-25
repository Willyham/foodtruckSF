<?php
class APIResponse{

    public static $RESPONSE_SUCCESS = 'success';
    public static $RESPONSE_FAILURE = 'failure';

    private $response;

    public function __construct(){
        $this->response = array(
            'result' => self::$RESPONSE_SUCCESS,
            'data' => array()
        );
    }

    public function setData($data){
        $this->response['data'] = $data;
    }

    public function failWithException(Exception $exception){
        $this->response['result'] = self::$RESPONSE_FAILURE;
        $this->response['message'] = $exception->getMessage();
        $this->response['code'] = $exception->getCode();
    }

    public function toJSON(){
        return json_encode($this->response);
    }

}