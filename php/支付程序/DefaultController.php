<?php

namespace backend\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\Response;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;
//use luweiss\wechat\Wechat;
use luweiss\Wechat\WechatPay;

class DefaultController extends Controller
{
    public $appId = 'wxf1ccf2bf44c7b499';
    public $openid = 'oFMhW4zOSgGRklkHUay3TaJO3vKg'; //openid 是根据appid和secret生成,不同小程序不同
    public $mchId = 1535389461;
    public $key = '3hIOHNd823j8hfa2hI7nMva25dCa9j0n';


    public function actionIndex()
    {
        echo 'test';
    }

    public function actionPay(){
        $no = \Yii::$app->request->get('no');

        $certPemFile = dirname(__FILE__)."/apiclient_cert.pem";
        $keyPemFile =  dirname(__FILE__)."/apiclient_key.pem";

        $wechatPay = new WechatPay([
            'certPemFile' => $certPemFile,
            'keyPemFile' => $keyPemFile,
            'mchId' => $this->mchId,
            'appId' => $this->appId,
            'key' => $this->key,
        ]);

        $body = 'SN'.$no;

        $res = $wechatPay->unifiedOrder([
            'body' => $body,
            'out_trade_no' => 'SN'.$no,
            'total_fee' => '1',
            'notify_url' => 'http://pay-notify.php',
            'trade_type' => 'JSAPI',
            'openid' => $this->openid,
        ]);

        $pay_data = [
            'appId' => $this->appId,
            'timeStamp' => '' . time(),
            'nonceStr' => $res['nonce_str'], //md5(uniqid())也可以
            'package' => 'prepay_id=' . $res['prepay_id'],
            'signType' => 'MD5',
        ];

        $pay_data['paySign'] = $wechatPay->makeSign($pay_data);

        $result =  [
            'code' => 0,
            'msg' => 'success',
            'data' => (object)$pay_data,
            'res' => $res,
            'body' => $body,
        ];

        return json_encode($result);
    }

    public function actionRefund(){
        $certPemFile = dirname(__FILE__)."/apiclient_cert.pem";
        $keyPemFile =  dirname(__FILE__)."/apiclient_key.pem";

        $no = \Yii::$app->request->get('no');

        $wechatPay = new WechatPay([
            'certPemFile' => $certPemFile,
            'keyPemFile' => $keyPemFile,
            'mchId' => $this->mchId,
            'appId' => $this->appId,
            'key' => $this->key,
        ]);

        $data = [
            'out_trade_no' => 'SN'.$no,
            'out_refund_no' => 'SN'.$no.time(),
            'total_fee' => 1,
            'refund_fee' => 1,
        ];

        $res = $wechatPay->refund($data);

        return json_encode($res);
    }
}
