var tools = {
    /**
     * 封装获取地址栏信息方法
     * @param
     * @returns
     */
    getUrl: function () {
        // var url = location.search; 获取url中"?"符后的字串
        var url = decodeURIComponent(window.location.search);
        // console.log(url,'地址栏中的url');
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.slice(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    parse: function (json) {
        try {
            return this.isObject(json)
                ? json
                : JSON.parse(json);
        } catch (e) {
            console.error('字符串转JSON对象失败！' + e);
            return { status: 'json parse fail！' };
        }
    },
    isObject: function (o) {
        var ots = Object.prototype.toString;
        return o && (o.constructor === Object || ots.call(o) === '[object Object]');
    },
    /* 获取当前日期 */
    getNowFormatDate: function (splitStr) {
        if (typeof splitStr === 'undefined') {
            splitStr = '-';
        }
        var date = new Date();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = '0' + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate;
        }
        var currentDate = date.getFullYear() + splitStr + month + splitStr + strDate;
        return currentDate;
    },
    // format dateTime "yyyy-MM-dd HH:mm:ss"
    dateFormat(dateTime, fmt = 'yyyy-MM-dd hh:mm:ss') {
        var o = {
            "M+": dateTime.getMonth() + 1, //月份 
            "d+": dateTime.getDate(), //日 
            "h+": dateTime.getHours(), //小时 
            "m+": dateTime.getMinutes(), //分 
            "s+": dateTime.getSeconds(), //秒 
            "q+": Math.floor((dateTime.getMonth() + 3) / 3), //季度 
            "S": dateTime.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    /**
  验证身份证是否有效
  参数
   num:'420984198007262347'  //  身份证号
   birth:'19800726'  //  出生日期
   sex:'F'  //  性别
  返回值
   1:验证通过;
   -1:身份证格式不正确;
   -2:身份证号跟出生日期不匹配;
   -3:身份证号跟性别不匹配;
   **/
    isIdCardNo(num, birth, sex) {
        num = num.toUpperCase();
        birth = birth || '';
        sex = sex || '';
        //  身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        if (!(/^(\d{17})([0-9]|X)$/.test(num))) {
            console.log('输入的身份证号长度不对，或者号码不符合规定！18位号码末位可以为数字或X。');
            return -1;
        }
        //  校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        //  下面分别分析出生日期和校验位
        var len,
            re;
        len = num.length;
        if (len === 18) {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            let arrSplit = num.match(re);

            //  检查生日日期是否正确
            let dtmBirth = new Date(arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            let bGoodDay = (dtmBirth.getFullYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]));
            if (!bGoodDay) {
                console.log('输入的身份证号里出生日期不对！');
                return -1;
            } else {
                //  检验18位身份证的校验码是否正确。
                //  校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var valnum;
                let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
                let nTemp = 0;
                for (let i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum !== num.substr(17, 1)) {
                    console.log('18位身份证的校验码不正确！应该为：' + valnum);
                    return -1;
                }

                //  检查出生日期是否匹配
                if (birth !== '') {
                    birth = new Date(birth.replace(/-/g, '/'));
                    if (birth.getFullYear() !== Number(arrSplit[2]) || (birth.getMonth() + 1) !== Number(arrSplit[3]) || birth.getDate() !== Number(arrSplit[4])) {
                        console.log('出生日期不匹配！');
                        return -2;
                    }
                }
                //  检查性别是否匹配
                if (sex !== '') {
                    let sexNo = num.substring(16, 17) % 2;
                    if ((sexNo === 0 && sex !== 'F') || (sexNo !== 0 && sex !== 'M')) {
                        console.log('性别不匹配！');
                        return -3;
                    }
                }
            }
        } else {
            return -1;
        }
        return 1;
    },
    /**
  验证邮政编码和验证码
  **/
    isZipCode(num) {
        // if (!(/^[1-9][0-9]{5}$/.test(num))) {
        if (!(/^[0-9]{6}$/.test(num))) {
            return false;
        }
        return true;
    },
    /**
  验证手机号
  **/
    isPhone(num) {
        if (!(/^1[3456789]\d{9}$/.test(num))) {
            return false;
        }
        return true;
    },
    /**
  验证数字
  **/
    isNumber(num) {
        if (!(/^[0-9]*$/.test(num))) {
            return false;
        }
        return true;
    },
    /**
     过滤非数字
     **/
    filterUnNumber(num) {
        if (num !== '') {
            var reg = /[0-9]*/g;
            var numList = num.match(reg);
            num = numList.join('');
        }
        return num;
    },
    /**
   过滤换行符
   **/
    filterWrap(str) {
        return str.replace(/<\/br>/g, '').replace(/\n/g, ' ').replace(/\r/g, ' ');
    },
    /**
  验证金额(格式保留一到两位小数)
  **/
    isMoney(num) {
        if (!(/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/.test(num))) {
            return false;
        }
        return true;
    },
    isEmail(str) {
        if (!(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(str))) {
            return false;
        }
        return true;
    },
    //获取中间所有日期的方法
    getAll(begin, end) {			// 开始日期和结束日期
        if (!begin || !end) {			// 去除空的可能性
            console.log('有时间为空')
            return false;
        }
        // 在时间Date的原型中定义一个format方法
        Date.prototype.format = function () {
            var s = "";				// 定义一个字符串，目的，要时间格式按照我们的要求拼接
            var month = this.getMonth() + 1;
            var day = this.getDate();
            s += this.getFullYear() + "-";
            s += month + "-";
            s += day;
            return s;			// 得到的格式如 "2018-11-20" 
        }
        var ab = begin.split('/');			// 把日期参数分割，注意，如果以'/'连接，则分割'/'
        var ae = end.split('/');
        var db = new Date();
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);			// 返回符合UTC的时间格式
        var de = new Date();
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
        var unixDb = db.getTime();
        var unixDe = de.getTime();
        var arr = [];
        for (var k = unixDb; k <= unixDe;) {
            arr.push((new Date(parseInt(k))).format());
            k = k + 24 * 60 * 60 * 1000;
        }
        return arr;			// 返回两个日期之间的所有日期数组。
    }
};
export default tools;
