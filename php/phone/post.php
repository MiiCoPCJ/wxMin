<?php
namespace Api\Controller;
use Think\Controller;
include_once __DIR__."/wx/errorCode.php";
include_once __DIR__."/wx/wxBizDataCrypt.php";
include_once __DIR__."/wx/pkcs7Encoder.php";
/**
 *     @brief  微信小程序api
 *     代驾 replace
 *     配送 distribution
 *     货运 driver
 *     生活 life
 *     维修 repairs
 */

class WeixinController extends ApiController{

    

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    //小程序ID
    protected static $appid = 'wx6d424ce04b9fdce8';
    //小程序密钥
    protected static $appsecret = 'ad2b3453f8b91c6fe8143e689151ee22';

    /**
     *     @brief  根据id获取公告
     *
     *     @param id    公告id
     *     @return      json
     *     @see    getNoticeById()    （weixin/getNoticeById）
     *     @note    ()
     */
    public function getNoticeById(){

        $id = I('id');

        if(empty($id)){
            \Org\Response::show(400,'缺少必要的参数！');
        }


        $data = D('notice')->field('content')->where("id = {$id}")->find();


        if($data){
            \Org\Response::show(200,"获取成功！",$data);
        }else{
            \Org\Response::show(400,"没有更多数据！");
        }

    }


    /**
     * @brief 推送测试
     */
    public function pushTest()
    {

        $openId = I('openId');
        $_formId = D('formid')->where(['is'=>0])->order('id desc')->find();
        $formId = $_formId['formId'];
        $_id = $_formId['id'];

        $access_token = $this->getAccessToken();

        $access_token = $access_token['access_token'];

        $url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send';

        $data = [
            'keyword1' => [
                'value' => '2016年8月8日'
            ],
            'keyword2' => [
                'value' => '银行转账'
            ],
            'keyword3' => [
                'value' => '100元'
            ],
            'keyword4' => [
                'value' => '财付通'
            ],
        ];


//        $data = [
//            'keyword1' => '2016年8月8日',
//            'keyword2' => '银行转账',
//            'keyword3' => '100元',
//            'keyword4' => '财付通',
//        ];


        $param = [
            'access_token' => $access_token,
            'touser' => $openId,
            'template_id' => '6ALr0V4a_ajiIp1Fe6gIYZS2ROKQ7mkvIBSbhFkqWN0',
            'page' => '',
            'form_id' => $formId,
            'data' => $data,
            'color' => '',
            'emphasis_keyword' => '',
        ];

        $url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='.$access_token;
        //$res = $this->request('POST',$url,$param);
        $res = $this->https_request($url,$param,'json');

        D('formid')->where(['id'=>$_id])->save(['is'=>1]);

        \Org\Response::show(0,"获取成功！",$res);
    }


    //解密,获取手机号
    public function decryptedPhone()
    {

        $appid = I('appid');
        $secret = I('secret');
        $js_code = I('code');
        $encryptedData = I('encryptedData');
        $iv = I('iv');

        $grant_type='authorization_code';

        $objSession=$this->http_curl("https://api.weixin.qq.com/sns/jscode2session?appid=$appid&secret=$secret&js_code=$js_code&grant_type=$grant_type");
        $session_key = json_decode($objSession,true)['session_key'];


        $data = '';


        $decodeData = new \WXBizDataCrypt($appid, $session_key);
        $errCode = $decodeData->decryptData($encryptedData, $iv, $data );

        \Org\Response::show(0,"获取成功！",$data);

    }
    function http_curl($url){
        $curl = curl_init();
        curl_setopt($curl,CURLOPT_URL,$url);
        curl_setopt($curl,CURLOPT_CONNECTTIMEOUT,30);
        curl_setopt($curl,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        $response=curl_exec($curl);
        curl_close($curl);
        return $response;
    }


    function https_request($url,$data,$type){
        if($type=='json'){
            $headers = array("Content-type: application/json;charset=UTF-8","Accept: application/json","Cache-Control: no-cache", "Pragma: no-cache");
            $data=json_encode($data);
        }

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        if (!empty($data)){
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS,$data);
        }
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt( $curl, CURLOPT_HTTPHEADER, $headers );
        $output = curl_exec($curl);
        curl_close($curl);
        return $output;
    }

    /**
     * @brief 存formId
     */
    public function saveFormId()
    {
        $formId = I('formId');
        $result = D('formid')->add(['formId'=>$formId,'is'=>0]);
        //查看最后sql查询
        //D('formid')->getlastsql();
        \Org\Response::show(0,"获取成功！",$result);
    }

    /**
     * @brief 获取微信openid
     */
    public function getOpenId()
    {
        $code = $_GET["code"];

        //api接口
        $api = "https://api.weixin.qq.com/sns/jscode2session";

        $param = [
            'appid' => self::$appid,
            'secret' => self::$appsecret,
            'js_code' => $code,
            'grant_type' => 'authorization_code',
        ];

        //获取GET请求
        $res = $this->request('POST',$api,$param);

        \Org\Response::show(200,"获取成功！",$res);

    }

    /**
     * @brief 获取微信accesstoken
     */
    public function getAccessToken()
    {

        $url = "https://api.weixin.qq.com/cgi-bin/token";
        $param = [
            'grant_type' => 'client_credential',
            'appid' => self::$appid,
            'secret' => self::$appsecret,
        ];

        $res = $this->request('GET',$url,$param);

        return $res;

    }



    /**
     * 发起一个HTTP/HTTPS的请求
     *
     * @param string $method     请求类型    GET | POST...
     * @param string $url        接口的URL
     * @param array  $params     接口参数   array('content'=>'test', 'format'=>'json');
     * @param arrat  $headers    扩展的包头信息
     * @param array  $files      图片信息
     *
     * @return json
     */
    public static function request($method, $url, array $params = array(), array $headers = array(), $files = [])
    {
        if (!function_exists('curl_init')) exit('Need to open the curl extension');
        $method = strtoupper($method);
        $timeout = $files ? 30 : 3;
        $ci = curl_init();
        curl_setopt($ci, CURLOPT_USERAGENT, 'PHP Http Client');
        curl_setopt($ci, CURLOPT_CONNECTTIMEOUT, 3);
        curl_setopt($ci, CURLOPT_TIMEOUT, $timeout);
        curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ci, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ci, CURLOPT_HEADER, false);
        if (!function_exists('curl_file_create')) {
            function curl_file_create($filename, $mimetype = '', $postname = '') {
                return "@$filename;filename="
                    . ($postname ?: basename($filename))
                    . ($mimetype ? ";type=$mimetype" : '');
            }
        }
        switch ($method) {
            case 'PUT':
            case 'POST':
            case 'PATCH':
                $method == 'POST' || curl_setopt($ci, CURLOPT_CUSTOMREQUEST, $method);
                curl_setopt($ci, CURLOPT_POST, true);
                if (!empty($files)) {
                    foreach($files as $index => $file) {
                        $params[$index] = curl_file_create($file);
                    }
                    if (phpversion() > '5.5') {
                        curl_setopt($ci, CURLOPT_SAFE_UPLOAD, false);
                    }
                    curl_setopt($ci, CURLOPT_POSTFIELDS, $params);
                    $headers[] = 'Expect: ';
                    $headers[] = 'Content-Type: multipart/form-data';
                } else {
                    curl_setopt($ci, CURLOPT_POSTFIELDS, http_build_query($params));
                }
                break;
            case 'GET':
            case 'HEAD':
            case 'DELETE':
            case 'OPTIONS':
                $method == 'GET' || curl_setopt($ci, CURLOPT_CUSTOMREQUEST, $method);
                if (!empty($params)) {
                    $url .= (strpos($url, '?') ? '&' : '?') . http_build_query($params);
                }
                break;
        }
        curl_setopt($ci, CURLINFO_HEADER_OUT, true);
        curl_setopt($ci, CURLOPT_URL, $url);
        if ($headers) {
            curl_setopt($ci, CURLOPT_HTTPHEADER, $headers);
        }
        $response = curl_exec($ci);
        if (curl_errno($ci)) {
            error_log("curl错误：" . curl_errno($ci) . ' : ' . curl_error($ci));
        }
        curl_close($ci);

        if(!empty($response)){
            $response = json_decode($response,true);
        }

        return $response;
    }

}
