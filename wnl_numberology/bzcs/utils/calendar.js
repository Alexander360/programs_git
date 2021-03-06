/**
 * @1900-2100区间内的公历',农历互转
 * @charset UTF-8
 * @Author  Jea杨(JJonline@JJonline.Cn) 
 * @Time    2014-7-21
 * @Time    2016-8-13 Fixed 2033hex',Attribution Annals
 * @Time    2016-9-25 Fixed lunar LeapMonth Param Bug
 * @Version 1.0.2
 * @公历转农历：calendar.solar2lunar(1987,11,01); //[you can ignore params of prefix 0]
 * @农历转公历：calendar.lunar2solar(1987,09,10); //[you can ignore params of prefix 0]
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.calendar = factory());
}(this, (function () {
  var calendar = {

		/**
		 * 农历1900-2100的润大小信息表
		 * @Array Of Property
		 * @return Hex 
		 */
    lunarInfo: [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, //1900-1909
      0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, //1910-1919
      0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, //1920-1929
      0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, //1930-1939
      0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, //1940-1949
      0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
      0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
      0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
      0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
      0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
      0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
      0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
      0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
      0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
      0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
      /**Add By JJonline@JJonline.Cn**/
      0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
      0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
      0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
      0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
      0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
      0x0d520
    ], //2100

		/**
		 * 公历每个月份的天数普通表
		 * @Array Of Property
		 * @return Number 
		 */
    solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

		/**
		 * 天干地支之天干速查表
		 * @Array Of Property trans['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
		 * @return Cn string 
		 */
    Gan: ['\u7532', '\u4e59', '\u4e19', '\u4e01', '\u620a', '\u5df1', '\u5e9a', '\u8f9b', '\u58ec', '\u7678'],

		/**
		 * 天干地支之地支速查表
		 * @Array Of Property 
		 * @trans['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
		 * @return Cn string 
		 */
    Zhi: ['\u5b50', '\u4e11', '\u5bc5', '\u536f', '\u8fb0', '\u5df3', '\u5348', '\u672a', '\u7533', '\u9149', '\u620c', '\u4ea5'],

		/**
		 * 天干地支之地支速查表<=>生肖
		 * @Array Of Property 
		 * @trans['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
		 * @return Cn string 
		 */
    Animals: ['\u9f20', '\u725b', '\u864e', '\u5154', '\u9f99', '\u86c7', '\u9a6c', '\u7f8a', '\u7334', '\u9e21', '\u72d7', '\u732a'],

		/**
		 * 24节气速查表
		 * @Array Of Property 
		 * @trans['小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至']
		 * @return Cn string 
		 */
    solarTerm: ['\u5c0f\u5bd2', '\u5927\u5bd2', '\u7acb\u6625', '\u96e8\u6c34', '\u60ca\u86f0', '\u6625\u5206', '\u6e05\u660e', '\u8c37\u96e8', '\u7acb\u590f', '\u5c0f\u6ee1', '\u8292\u79cd', '\u590f\u81f3', '\u5c0f\u6691', '\u5927\u6691', '\u7acb\u79cb', '\u5904\u6691', '\u767d\u9732', '\u79cb\u5206', '\u5bd2\u9732', '\u971c\u964d', '\u7acb\u51ac', '\u5c0f\u96ea', '\u5927\u96ea', '\u51ac\u81f3'],

		/**
		 * 数字转中文速查表
		 * @Array Of Property 
		 * @trans ['日','一','二','三','四','五','六','七','八','九','十']
		 * @return Cn string 
		 */
    nStr1: ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u4e03', '\u516b', '\u4e5d', '\u5341'],

		/**
		 * 日期转农历称呼速查表
		 * @Array Of Property 
		 * @trans ['初','十','廿','卅']
		 * @return Cn string 
		 */
    nStr2: ['\u521d', '\u5341', '\u5eff', '\u5345'],

		/**
		 * 月份转农历称呼速查表
		 * @Array Of Property 
		 * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
		 * @return Cn string 
		 */
    nStr3: ['\u6b63', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u4e03', '\u516b', '\u4e5d', '\u5341', '\u51ac', '\u814a'],

		/**
		 * 返回农历y年一整年的总天数
		 * @param lunar Year
		 * @return Number
		 * @eg:var count = calendar.lYearDays(1987) ;//count=387
		 */
    lYearDays: function (y) {
      var i, sum = 348;
      for (i = 0x8000; i > 0x8; i >>= 1) {
        sum += (calendar.lunarInfo[y - 1900] & i) ? 1 : 0;
      }
      return (sum + calendar.leapDays(y));
    },

		/**
		 * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
		 * @param lunar Year
		 * @return Number (0-12)
		 * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
		 */
    leapMonth: function (y) { //闰字编码 \u95f0
      return (calendar.lunarInfo[y - 1900] & 0xf);
    },

		/**
		 * 返回农历y年闰月的天数 若该年没有闰月则返回0
		 * @param lunar Year
		 * @return Number (0',29',30)
		 * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
		 */
    leapDays: function (y) {
      if (calendar.leapMonth(y)) {
        return ((calendar.lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
      }
      return (0);
    },

		/**
		 * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
		 * @param lunar Year
		 * @return Number (-1',29',30)
		 * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
		 */
    monthDays: function (y, m) {
      if (m > 12 || m < 1) {
        return -1;
      } //月份参数从1至12，参数错误返回-1
      return ((calendar.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
    },

		/**
		 * 返回公历(!)y年m月的天数
		 * @param solar Year
		 * @return Number (-1',28',29',30',31)
		 * @eg:var solarMonthDay = calendar.leapDays(1987) ;//solarMonthDay=30
		 */
    solarDays: function (y, m) {
      if (m > 12 || m < 0) {
        return -1;
      } //若参数错误 返回-1
      var ms = m;
      if (ms == 1) { //2月份的闰平规律测算后确认返回28或29
        return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
      }
      else {
        return (calendar.solarMonth[ms]);
      }
    },

		/**
		 * 农历年份转换为干支纪年
		 * @param  lYear 农历年的年份数
		 * @return Cn string
		 */
    toGanZhiYear: function (y, m, d) {
      let cY = '';
      if (m < 2) {
        cY = calendar.cyclical(y - 1900 + 36 - 1);
      }
      else {
        cY = calendar.cyclical(y - 1900 + 36);
      }
      let term2 = calendar.getTerm(y, 3); //立春日期
      if (m === 1 && d >= term2) {
        cY = calendar.cyclical(y - 1900 + 36);
      }
      return cY;
    },
    //============================== 传入 offset 返回干支, 0=甲子
    cyclical: function (num) {
      return (calendar.Gan[num % 10] + calendar.Zhi[num % 12]);
    },

		/**
		 * 公历月',日判断所属星座
		 * @param  cMonth [description]
		 * @param  cDay [description]
		 * @return Cn string
		 */
    toAstro: function (cMonth, cDay) {
      var s = '\u6469\u7faf\u6c34\u74f6\u53cc\u9c7c\u767d\u7f8a\u91d1\u725b\u53cc\u5b50\u5de8\u87f9\u72ee\u5b50\u5904\u5973\u5929\u79e4\u5929\u874e\u5c04\u624b\u6469\u7faf';
      var arr = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
      return s.substr(cMonth * 2 - (cDay < arr[cMonth - 1] ? 2 : 0), 2) + '\u5ea7'; //座
      // return s.substr(m * 2 - (d < '102223444433'.charAt(m - 1) - -19) * 2, 2) + '\u5ea7';
    },

		/**
		 * 传入offset偏移量返回干支
		 * @param offset 相对甲子的偏移量
		 * @return Cn string
		 */
    toGanZhi: function (offset) {
      return calendar.Gan[offset % 10] + calendar.Zhi[offset % 12];
    },
		/**
		 * 传入公历(!)y年获得该年第n个节气的公历那个月的日期数值
		 * @param y公历年(1900-2100)；n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起 
		 * @return day Number
		 * @eg:var _24 = calendar.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
		 */
    getTerm: function (y, n) {
      var offset = calendar.getOffsetByTerm(y, n - 1);
      var dateObj = calendar.getDateObjByOffset(y, offset);
      return dateObj.getDate();
    },

		/**
		 * 传入农历数字月份返回汉语通俗表示法
		 * @param lunar month
		 * @return Cn string
		 * @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
		 */
    toChinaMonth: function (m) { // 月 => \u6708
      if (m > 12 || m < 1) {
        return -1;
      } //若参数错误 返回-1
      var s = calendar.nStr3[m - 1];
      s += '\u6708'; //加上月字
      return s;
    },

		/**
		 * 传入农历日期数字返回汉字表示法
		 * @param lunar day
		 * @return Cn string
		 * @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
		 */
    toChinaDay: function (d) { //日 => \u65e5
      var s;
      switch (d) {
        case 10:
          s = '\u521d\u5341';
          break;
        case 20:
          s = '\u4e8c\u5341';
          break;
        case 30:
          s = '\u4e09\u5341';
          break;
        default:
          s = calendar.nStr2[Math.floor(d / 10)];
          s += calendar.nStr1[d % 10];
      }
      return (s);
    },

		/**
		 * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
		 * @param y year
		 * @return Cn string
		 * @eg:var animal = calendar.getAnimal(1987) ;//animal='兔'
		 */
    getAnimal: function (year, month, day) {
      month--;
      var start = 1900,
        value = '';
      var x = (year - start) % 12;
      if (x !== 0 && calendar.getLichunOffset(year, month, day) < 0) {
        x -= 1;
      }
      value = calendar.Animals[x];
      return value;
    },
    //===================返回属相
    getLichunOffset: function (year, month, day) {
      var lichunDate = new Date(year, 0, 1);
      lichunDate.setDate(lichunDate.getDate() + TermTable[(year - 1900) * 24 + 2]);
      var calDate = new Date(year, month, day);
      return (calDate - lichunDate);
    },
    //返回一种的第几周
    getYearWeek: function (a, b, c) {
      var d1 = new Date(a, b, c),
        d2 = new Date(a, 0, 1),
        d = calendar.dayOfYear(d1);
      var num = Math.ceil((d + ((d2.getDay() + 1) - 1)) / 7);
      if (num > 1 && b === 11) {
        var nextYearDate = new Date(a + 1, 0, 1);
        var interval = nextYearDate.getDay();
        if (interval > 0 && calendar.getIntervalDays(d1, nextYearDate) <= interval) {
          num = 1;
        }
      }
      return num;
    },
    isEaster: function (y, m, d) {
      var C = Math.floor(y / 100);
      var N = y - 19 * Math.floor(y / 19);
      var K = Math.floor((C - 17) / 25);
      var I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
      I = I - 30 * Math.floor((I / 30));
      I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
      var J = y + Math.floor(y / 4) + I + 2 - C + Math.floor(C / 4);
      J = J - 7 * Math.floor(J / 7);
      var L = I - J;
      var M = 3 + Math.floor((L + 40) / 44);
      var D = L + 28 - 31 * Math.floor(M / 4);
      return m === M && d === D;
    },

		/**
		 * 传入阳历年月日获得详细的公历',农历object信息 <=>JSON
		 * @param y  solar year
		 * @param m  solar month
		 * @param d  solar day
		 * @return JSON object
		 * @eg:console.log(calendar.solar2lunar(1987,11,01));
		 */
    solar2lunar: function (y, m, d) { //参数区间1900.1.31~2100.12.31
      if (y < 1900 || y > 2100) { //年份限定',上限
        return -1;
      }
      if (y == 1900 && m == 0 && d < 31) { //下限
        return -1;
      }
      var objDate = new Date();
      if (!y) { //未传参  获得当天
        objDate = new Date();
      }
      else {
        objDate = new Date(y, parseInt(m), d);
      }
      var i, leap = 0,
        temp = 0;
      //修正ymd参数
      y = objDate.getFullYear(), m = objDate.getMonth(), d = objDate.getDate();
      m++;
      var offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
      for (i = 1900; i < 2101 && offset > 0; i++) {
        temp = calendar.lYearDays(i);
        offset -= temp;
      }
      if (offset < 0) {
        offset += temp;
        i--;
      }
      //是否今天
      var isTodayObj = new Date(),
        isToday = false;
      if (isTodayObj.getFullYear() == y && isTodayObj.getMonth() + 1 == m && isTodayObj.getDate() == d) {
        isToday = true;
      }
      //星期几
      var nWeek = objDate.getDay(),
        cWeek = calendar.nStr1[nWeek];
      //农历年
      var year = i;
      leap = calendar.leapMonth(i); //闰哪个月
      var isLeap = false;

      //效验闰月
      for (i = 1; i < 13 && offset > 0; i++) {
        //闰月
        if (leap > 0 && i == (leap + 1) && isLeap == false) {
          --i;
          isLeap = true;
          temp = calendar.leapDays(year); //计算农历闰月天数
        }
        else {
          temp = calendar.monthDays(year, i); //计算农历普通月天数
        }
        //解除闰月
        if (isLeap == true && i == (leap + 1)) {
          isLeap = false;
        }
        offset -= temp;
      }

      if (offset == 0 && leap > 0 && i == leap + 1) {
        if (isLeap) {
          isLeap = false;
        }
        else {
          isLeap = true;
          --i;
        }
      }
      if (offset < 0) {
        offset += temp;
        --i;
      }
      //农历月
      var month = i;
      //农历日
      var day = offset + 1;
      //天干地支处理
      var sm = m - 1;
      var gzY = calendar.toGanZhiYear(y, m - 1, d);
      //月柱 1900年1月小寒以前为 丙子月(60进制12)
      var firstNode = calendar.getTerm(y, (m * 2 - 1)); //返回当月「节」为几日开始
      var secondNode = calendar.getTerm(y, (m * 2)); //返回当月「节」为几日开始
      //依据12节气修正干支月
      var gzM = calendar.toGanZhi((y - 1900) * 12 + m + 11);
      if (d >= firstNode) {
        gzM = calendar.toGanZhi((y - 1900) * 12 + m + 12);
      }
      //传入的日期的节气与否
      var isTerm = false;
      var Term = null;
      if (firstNode === d) {
        isTerm = true;
        Term = calendar.solarTerm[m * 2 - 2];
      }
      if (secondNode === d) {
        isTerm = true;
        Term = calendar.solarTerm[m * 2 - 1];
      }
      //日柱 当月一日与 1900/1/1 相差天数
      var dayCyclical = Date.UTC(y, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
      var gzD = calendar.toGanZhi(dayCyclical + d - 1);
      //该日期所属的星座
      var astro = calendar.toAstro(m, d);

      return {
        'lYear': year,
        'lMonth': month,
        'lDay': day,
        'Animal': calendar.getAnimal(y, m, d),
        'IMonthCn': (isLeap ? '\u95f0' : '') + calendar.toChinaMonth(month),
        'IDayCn': calendar.toChinaDay(day),
        'cYear': y,
        'cMonth': m,
        'cDay': d,
        'gzYear': gzY,
        'gzMonth': gzM,
        'gzDay': gzD,
        'isToday': isToday,
        'isLeap': isLeap,
        'nWeek': nWeek,
        'ncWeek': '\u661f\u671f' + cWeek,
        'isTerm': isTerm,
        'Term': Term,
        'astro': astro
      };
    },

		/**
		 * 传入农历年月日以及传入的月份是否闰月获得详细的公历',农历object信息 <=>JSON
		 * @param y  lunar year
		 * @param m  lunar month
		 * @param d  lunar day
		 * @param isLeapMonth  lunar month is leap or not.[如果是农历闰月第四个参数赋值true即可]
		 * @return JSON object
		 * @eg:console.log(calendar.lunar2solar(1987,9,10));
		 */
    lunar2solar: function (y, m, d, isLeapMonth) { //参数区间1900.1.31~2100.12.1
      isLeapMonth = !!isLeapMonth;
      // var leapOffset = 0;
      var leapMonth = calendar.leapMonth(y);
      // var leapDay = calendar.leapDays(y);
      if (isLeapMonth && (leapMonth != m)) { //传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
        return -1;
      }
      if (y == 2100 && m == 12 && d > 1 || y == 1900 && m == 1 && d < 31) { //超出了最大极限值 
        return -1;
      }
      var day = calendar.monthDays(y, m);
      var _day = day;
      //bugFix 2016-9-25 
      //if month is leap, _day use leapDays method 
      if (isLeapMonth) {
        _day = calendar.leapDays(y, m);
      }
      if (y < 1900 || y > 2100 || d > _day) { //参数合法性效验 
        return -1;
      }
      //计算农历的时间差
      var offset = 0;
      for (var i = 1900; i < y; i++) {
        offset += calendar.lYearDays(i);
      }
      var leap = 0,
        isAdd = false;
      for (i = 1; i < m; i++) {
        leap = calendar.leapMonth(y);
        if (!isAdd) { //处理闰月
          if (leap <= i && leap > 0) {
            offset += calendar.leapDays(y);
            isAdd = true;
          }
        }
        offset += calendar.monthDays(y, i);
      }
      //转换闰月农历 需补充该年闰月的前一个月的时差
      if (isLeapMonth) {
        offset += day;
      }
      //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
      var stmap = Date.UTC(1900, 1, 30, 0, 0, 0);
      var calObj = new Date((offset + d - 31) * 86400000 + stmap);
      var cY = calObj.getUTCFullYear();
      var cM = calObj.getUTCMonth();
      var cD = calObj.getUTCDate();
      return calendar.solar2lunar(cY, cM, cD);
    },

    BASE_STEMS_DATE: new Date(1899, 1, 4, 0, 0),
    BASE_STEMS_YEAR: 1899,
    JXNames: ['吉', '凶'],
    JXStatusUnknown: -1,
    JXStatusJi: 0,
    JXStatusXiong: 1,
    JXTable: [
      0xD2C, 0x34B, 0xCD2, 0xB34, 0x2CD, 0x4B3, 0xD2C, 0x34B, 0xCD2, 0xB34, //甲子，乙丑，丙寅，丁卯，戊辰，己巳，庚午，辛未，壬申，癸酉
      0x2DD, 0x4A3, 0xD2C, 0x34B, 0xCD2, 0xB34, 0x2C5, 0x4B2, 0xD2C, 0x34B, //甲戌，乙亥，丙子，丁丑，戊寅，己卯，庚辰，辛巳，壬午，癸未
      0xCD2, 0xB34, 0x2CD, 0x4B3, 0xD2C, 0x34A, 0xCD2, 0xB34, 0x2CD, 0x4B3, //甲申，乙酉，丙戌，丁亥，戊子，己丑，庚寅，辛卯，壬辰，癸巳
      0xD2C, 0x34B, 0xCD2, 0xB34, 0x2CD, 0x4B3, 0xD2C, 0x34B, 0xCD2, 0xB24, //甲午，乙未，丙申，丁酉，戊戌，己亥，庚子，辛丑，壬寅，癸卯
      0x2CD, 0x4A3, 0xD28, 0x34B, 0xCD2, 0xB34, 0x2CD, 0x4A3, 0xD2C, 0x34B, //甲辰，乙巳，丙午，丁未，戊申，己酉，庚戌，辛亥，壬子，癸丑
      0xCD2, 0xB34, 0x2CD, 0x4B3, 0xD2C, 0x34B, 0xCF2, 0xB34, 0x2CD, 0x4B3 //甲寅，乙卯，丙辰，丁巳，戊午，己未，庚申，辛酉，壬戌，癸亥
    ],
    mPzStemArray: ['甲不开仓财物耗散', '乙不栽植千株不长', '丙不修灶必见灾殃', '丁不剃头头必生疮', '戊不受田田主不祥',
      '己不破券二比并亡', '庚不经络织机虚张', '辛不合酱主人不尝', '壬不汲水更难提防', '癸不词讼理弱敌强'
    ],

    mPzBranchArray: ['子不问卜自惹祸殃', '丑不冠带主不还乡', '寅不祭祀神鬼不尝', '卯不穿井水泉不香', '辰不哭泣必主重丧', '巳不远行财物伏藏',
      '午不苫盖屋主更张', '未不服药毒气入肠', '申不安床鬼祟入房', '酉不宴客醉坐颠狂', '戌不吃犬作怪上床', '亥不嫁娶不利新郎'
    ],
    CompassUnknown: -1,
    CompassNorth: 0,
    CompassNortheast: 1,
    CompassEast: 2,
    CompassSoutheast: 3,
    CompassSouth: 4,
    CompassSouthwest: 5,
    CompassWest: 6,
    CompassNorthwest: 7,
    CompassNames: ['正北', '东北', '正东', '东南', '正南', '西南', '正西', '西北'],
    ANIMAL: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
    mWxMap: {
      '甲子': '海中金',
      '乙丑': '海中金',
      '丙寅': '炉中火',
      '丁卯': '炉中火',
      '戊辰': '大林木',
      '己巳': '大林木',
      '庚午': '路旁土',
      '辛未': '路旁土',
      '壬申': '剑锋金',
      '癸酉': '剑锋金',
      '甲戌': '山头火',
      '乙亥': '山头火',
      '丙子': '涧下水',
      '丁丑': '涧下水',
      '戊寅': '城头土',
      '己卯': '城头土',
      '庚辰': '白腊金',
      '辛巳': '白腊金',
      '壬午': '杨柳木',
      '癸未': '杨柳木',
      '甲申': '泉中水',
      '乙酉': '泉中水',
      '丙戌': '屋上土',
      '丁亥': '屋上土',
      '戊子': '霹雳火',
      '己丑': '霹雳火',
      '庚寅': '松柏木',
      '辛卯': '松柏木',
      '壬辰': '长流水',
      '癸巳': '长流水',
      '甲午': '沙中金',
      '乙未': '沙中金',
      '丙申': '山下火',
      '丁酉': '山下火',
      '戊戌': '平地木',
      '己亥': '平地木',
      '庚子': '壁上土',
      '辛丑': '壁上土',
      '壬寅': '金箔金',
      '癸卯': '金箔金',
      '甲辰': '覆灯火',
      '乙巳': '覆灯火',
      '丙午': '天河水',
      '丁未': '天河水',
      '戊申': '大驿土',
      '己酉': '大驿土',
      '庚戌': '钗钏金',
      '辛亥': '钗钏金',
      '壬子': '桑拓木',
      '癸丑': '桑拓木',
      '甲寅': '大溪水',
      '乙卯': '大溪水',
      '丙辰': '沙中土',
      '丁巳': '沙中土',
      '戊午': '天上火',
      '己未': '天上火',
      '庚申': '石榴木',
      '辛酉': '石榴木',
      '壬戌': '大海水',
      '癸亥': '大海水'
    },
    querySAByDay: function (date, jxData, fetusData) {
      var hlObj = {};
      var gzDay = calendar.getStemsBranchDay(date);
      var gzMonth = calendar.getStemsBranchMonth(date.getFullYear(), calendar.dayOfYear(date) - 1);
      var gzStr = calendar.getStemsBranchDayAsString(date);
      var dayTg = gzDay % 10;
      var dayDz = gzDay % 12;
      var pzbj = calendar.mPzStemArray[dayTg] + ' ' + calendar.mPzBranchArray[dayDz]; //彭祖百忌
      hlObj.pzbj = pzbj;
      var jsyq = ''; //
      var xsyj = ''; //
      var value = (gzMonth + 10) % 12 + 1;
      if (jxData[value + '-' + gzStr]) {
        jsyq = jxData[value + '-' + gzStr].JSYQ; //吉神宜趋
        xsyj = jxData[value + '-' + gzStr].XSYJ; //凶神宜忌
        hlObj.jsyq = jsyq;
        hlObj.xsyj = xsyj;
      }
      var wx = ''; //五行
      if (calendar.mWxMap[gzStr]) {
        wx = calendar.mWxMap[gzStr];
        hlObj.wx = wx;
      }
      var cs = calendar.cxInfoOfDateTime(date, -2); //冲煞
      hlObj.cs = cs;
      var zhishen = calendar.zhiShenOfMonth(gzMonth % 12, gzDay % 12);
      hlObj.zhishen = zhishen;
      var jianchu = calendar.jianChuOfDate(date);
      hlObj.jianchu = jianchu;
      var stars28 = calendar.stars28OfDate(date);
      hlObj.stars28 = stars28;
      var monthDizhiString = calendar.getStemsBranchMonthAsString(date.getFullYear(), calendar.dayOfYear(date) - 1);
      var dayDzString = calendar.getStemsBranchDayAsString(date);
      var taishen = calendar.taiShenOfMonthDiZhi(monthDizhiString, dayDzString, fetusData);
      hlObj.taishen = taishen;

      return hlObj;
    },
    getStemsBranchDayAsString: function (date) {
      return calendar.formatStemsBranchString(calendar.getStemsBranchDay(date));
    },
    jianChuOfDate: function (date) {
      var baseDate = new Date(1901, 0, 1);
      var thisDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      var arr = calendar.twentyFourTermdaysOf(thisDate);
      var jx = -1;
      if (arr.length == 2) {
        var a = parseInt(arr[0]);
        var b = parseInt(arr[arr.length - 1]);
        var offsetDayCount = a % 2 == 0 ? a / 2 : a / 2 + 1;
        if (b && a % 2 == 0) {
          offsetDayCount += 1;
        }
        var interval = Math.abs((thisDate.getTime() - baseDate.getTime()) / 1000);
        var day = interval / (24 * 60 * 60);
        jx = Math.ceil((5 + day - offsetDayCount) % 12);
      }
      var jianchuIndex = 0;
      if (jx >= 2) {
        jianchuIndex = jx - 2;
      }
      else {
        jianchuIndex = jx + 10;
      }
      var jianchuArray = ['建日', '除日', '满日', '平日', '定日', '执日', '破日', '危日', '成日', '收日', '开日', '闭日'];

      return jianchuArray[jianchuIndex];
    },
    stars28OfDate: function stars28OfDate(date) {
      var B = (date.getFullYear() - 1) * 365;
      for (var i = 0; i < date.getMonth(); i++) {
        B += calendar.dayCountOfMonth(i, 0);
      }
      B += date.getDate();
      var fixValue1 = 0; //常值为0，，切在3月1日以后(31+29+1)，则为1，其他仍然为0
      var fixValue2 = 13; //1900-1999年修正值为13，2000-2099的修正值也为13
      if (calendar.isLeapYear(date.getFullYear())) {
        if (date.getMonth() + 1 > 3 || (date.getMonth() + 1 == 3 && date.getDate() >= 1)) {
          fixValue1 = 1;
        }
      }
      var C = Math.floor((date.getFullYear() - 1) / 4 - fixValue2 + fixValue1);
      var A = B + C;
      var index_28Stars = (A + 23) % 28;
      var star28Arr = ['轸水蚓宿星', '角木蛟宿星', '亢金龙宿星', '氐土貉宿星', '房日兔宿星', '心月狐宿星', '尾火虎宿星', '箕水豹宿星', '斗木獬宿星', '牛金牛宿星', '女土蝠宿星', '虚日鼠宿星', '危月燕宿星', '室火猪宿星', '璧水貐宿星', '奎木狼宿星', '娄金狗宿星', '胃土雉宿星',
        '昴日鸡宿星', '毕月乌宿星', '觜火猴宿星', '参水猿宿星', '井木犴宿星', '鬼金羊宿星', '柳土獐宿星', '星日马宿星', '张月鹿宿星', '翼火蛇宿星'
      ];
      return star28Arr[index_28Stars];
    },
    //JS判断闰年代码
    isLeapYear: function (Year) {
      if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
        return true;
      }
      else {
        return false;
      }
    },
    dayCountOfMonth: function (month, isLeap) {
      switch (month + 1) {
        case 1:
          return 31;
        case 2:
          if (!isLeap) {
            return 28;
          }
          return 29;
        case 3:
          return 31;
        case 4:
          return 30;
        case 5:
          return 31;
        case 6:
          return 30;
        case 7:
          return 31;
        case 8:
          return 31;
        case 9:
          return 30;
        case 10:
          return 31;
        case 11:
          return 30;
        case 12:
          return 31;
        default:
          break;
      }
      return 0;
    },
    taiShenOfMonthDiZhi: function (monthDizhi, tgdzDay, fetusData) {
      var code = calendar.codeForMonthDizhi(monthDizhi);
      var result = calendar.taiShenWithCode(code, tgdzDay, fetusData);
      return result;
    },
    codeForMonthDizhi: function (monthDizhi) {
      var zhiCode = {
        '子': 11,
        '丑': 12,
        '寅': 1,
        '卯': 2,
        '辰': 3,
        '巳': 4,
        '午': 5,
        '未': 6,
        '申': 7,
        '酉': 8,
        '戌': 9,
        '亥': 10
      };
      return zhiCode[monthDizhi];
    },
    taiShenWithCode: function (code, tgdzDay, fetusData) {
      var codeString = code + '-' + tgdzDay;
      var taishen = fetusData[codeString];
      return taishen ? taishen : '暂无';
    },
    getStemsBranchMonthAsString: function (year, dayInYear) {
      return calendar.formatBranchMonthString(calendar.getStemsBranchMonth(year, dayInYear));
    },
    formatBranchMonthString: function (index) {
      if (index < 0) {
        return '';
      }
      return calendar.Zhi[index % 12];
    },
		/**
		 * 冲煞
		 *
		 * @param solar
		 * @param lunar
		 * @return
		 */
    cxInfoOfDateTime: function (solar, lunar) {
      var branchIndex = calendar.branchIndexOfSolar(solar, lunar);
      var cindex = calendar.chongIndexOfDateTime(branchIndex);
      var sindex = calendar.shaDirectionOfDateTime(branchIndex);
      try {
        return '冲' + calendar.ANIMAL[cindex] + '煞' + calendar.CompassNames[sindex].replace('正', '');
      }
      catch (e) {
        return '';
      }
    },
		/**
		 * branchIndex
		 *
		 * @param solar
		 * @param hour  -2:ignoreTime -1:currenttime
		 * @return
		 */
    branchIndexOfSolar: function (solar, hour) {
      var branchIndex = -1;
      if (hour == -2) {
        return calendar.getBranchDay(solar);
      }
      else {
        branchIndex = calendar.getStemBranchHour(solar, hour) % 12;
      }
      return branchIndex;
    },
    getBranchDay: function (solar) {
      var dayOffset = calendar.getIntervalDays(calendar.BASE_STEMS_DATE, solar);
      if (dayOffset > 0) {
        return Math.floor((dayOffset + 3) % 12);
      }
      return 0;
    },
		/*
		子午相冲，丑未相冲，寅申相冲，辰戌相冲，巳亥相冲，卯酉相冲
		*/
    chongIndexOfDateTime: function (branchIndex) {
      var value = -1;
      switch (branchIndex) {
        case 0:
          value = 6;
          break;
        case 1:
          value = 7;
          break;
        case 2:
          value = 8;
          break;
        case 3:
          value = 9;
          break;
        case 4:
          value = 10;
          break;
        case 5:
          value = 11;
          break;
        case 6:
          value = 0;
          break;
        case 7:
          value = 1;
          break;
        case 8:
          value = 2;
          break;
        case 9:
          value = 3;
          break;
        case 10:
          value = 4;
          break;
        case 11:
          value = 5;
          break;
        default:
          break;
      }
      return value;
    },
		/*
		逢巳日、酉日、丑日必是“煞东”；亥日、卯日、未日必“煞西”；申日、子日、辰日必“煞南”；寅日、午日、戌日必“煞北”
		*/
    shaDirectionOfDateTime: function (branchIndex) {
      var value = calendar.CompassUnknown;
      switch (branchIndex) {
        case 0: //子
        case 4: //辰
        case 8: //申
          value = calendar.CompassSouth;
          break;
        case 1: //丑
        case 5: //巳
        case 9: //酉
          value = calendar.CompassEast;
          break;
        case 2: //寅
        case 6: //午
        case 10: //戌
          value = calendar.CompassNorth;
          break;
        case 3: //卯
        case 7: //未
        case 11: //亥
          value = calendar.CompassWest;
          break;
        default:
          break;
      }
      return value;
    },
		/*
		 * 获取干支计时
		 *
		 * @param _date
		 * @param lunarHour
		 * @return
		 */
    getStemsBranchHourAsString: function (date, hour) {
      let lunarHour = calendar.getLunarHourIndex(hour);
      return calendar.formatStemsBranchString(calendar.getStemBranchHour(date, lunarHour));
    },
    //小时获取时辰
    getLunarHourIndex: function (hour) {
      return (Math.floor(hour / 2) + hour % 2) % 12;
    },
    getStemBranchHour: function (_date, lunarHour) {
      var dayOffset = calendar.getIntervalDays(calendar.BASE_STEMS_DATE, _date);
      var dt = parseInt((dayOffset + 9) % 10);
      var hb = lunarHour;
      var ht = (hb + ((dt > 4) ? (dt - 5) : dt) * 2) % 10;
      var termHour = ((6 * ht - 5 * hb) + 60) % 60;
      return termHour;
    },
    formatStemsBranchString: function (index) {
      if (index < 0) {
        return '';
      }
      return calendar.Gan[index % 10] + calendar.Zhi[index % 12];
    },
    getIntervalDays: function (base_date, _date) {
      _date.setHours(0);
      _date.setMinutes(0);
      _date.setSeconds(0);
      _date.setMilliseconds(0);
      return Math.floor((_date - base_date) / (1000 * 60 * 60 * 24));
    },
		/**
		 * 得到宜忌查询需要的参数
		 * <p/>
		 * param dateObj
		 * return
		 */
    getYJSqlFields: function (dateObj) {
      var field = ['-1', '-1'];
      var arr = calendar.twentyFourTermdaysOf(dateObj);
      if (arr.length == 2) {
        var a = arr[0];
        var b = arr[1];
        var offsetDayCount = Math.floor(a % 2 == 0 ? a / 2 : a / 2 + 1);
        if (b > 0 && a % 2 == 0) {
          offsetDayCount += 1;
        }
        // 计算当前日期距离1901-1-1多少天
        var baseDate = new Date(1901, 0, 1); //JCalendar.createFromString('1901-01-01');
        var day = Math.abs(calendar.getIntervalDays(baseDate, dateObj));
        field[0] = (15 + day) % 60 + '';
        field[1] = Math.floor(Math.abs((5 + day - offsetDayCount) % 12)) + '';
      }
      return field;
    },
    twentyFourTermdaysOf: function (dateObj) {
      try {
        var year = dateObj.getFullYear();
        var yearOffset = year - 1900;
        var offset = calendar.dayOfYear(dateObj) - 1;
        var index = 0;
        var st = 0; // 改日是否为24节气
        for (var i = 0; i < 24; i++) {
          var num = TermTable[yearOffset * 24 + i];
          if (num > offset) {
            index = i;
            st = 0;
            break;
          }
          else if (num == offset) {
            index = i;
            st = 1;
            break;
          }
        }
        var a = index + yearOffset * 24 - 24; // 莫日之前的节气数目
        var b = st;

        return [a, b];

      }
      catch (e) {
        return null;
      }
    },

		/**
		 * 根据日期对象获得是当前年份的第几天
		 * 
		 * @param {any} 日期对象
		 * @returns
		 */
    dayOfYear: function (date) {
      var dateArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
      var day = date.getDate();
      var month = date.getMonth(); //getMonth()是从0开始
      var year = date.getFullYear();
      var result = 0;
      for (var i = 0; i < month; i++) {
        result += dateArr[i];
      }
      result += day;
      //判断是否闰年
      if (month > 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        result += 1;
      }
      return result;
    },
		/**
		 * 计算当前时辰吉凶
		 *
		 * @param solar
		 * @return
		 */
    jixiongStatusOfDateTime: function (solar, hourNow) {
      var status = calendar.JXStatusUnknown;
      var stemIndex = calendar.getStemsBranchDay(solar); //[self.lunarMgr stemBranchDayOfSolarDate:solar];
      if (stemIndex > -1 && stemIndex < 60) {
        var hexValue = calendar.JXTable[stemIndex];
        var chineseHour = calendar.getLunarHourIndex(hourNow); //[datetime ylChineseNumHour];
        var moveCount = (11 - chineseHour);
        var value = (hexValue >> moveCount) & 0x1;
        status = value > 0 ? calendar.JXStatusJi : calendar.JXStatusXiong;
      }
      return calendar.getJXName(status);
    },
    getStemsBranchDay: function (date) {
      var dayOffset = calendar.getIntervalDays(calendar.BASE_STEMS_DATE, date);
      if (dayOffset > 0) {
        var t = parseInt((dayOffset + 9) % 10);
        var b = parseInt((dayOffset + 3) % 12);
        return ((6 * t - 5 * b) + 60) % 60;
      }
      return -1;
    },
		/**
		 * 吉凶名称
		 *
		 * @param value
		 * @return
		 */
    getJXName: function (value) {
      if (value < 0 || value > calendar.JXNames.length) {
        return '';
      }
      return calendar.JXNames[value];
    },
    zhiShenOfMonth: function (monthDz, dayDz) {
      var beginIndex = monthDz;
      var qinglongBeginIndex = 0;
      if (beginIndex == 0 || beginIndex == 6) {
        qinglongBeginIndex = 8;
      }
      else if (beginIndex == 1 || beginIndex == 7) {
        qinglongBeginIndex = 10;
      }
      else if (beginIndex == 2 || beginIndex == 8) {
        qinglongBeginIndex = 0;
      }
      else if (beginIndex == 3 || beginIndex == 9) {
        qinglongBeginIndex = 2;
      }
      else if (beginIndex == 4 || beginIndex == 10) {
        qinglongBeginIndex = 4;
      }
      else if (beginIndex == 5 || beginIndex == 11) {
        qinglongBeginIndex = 6;
      }

      var ishen_12 = (dayDz - qinglongBeginIndex);
      if (ishen_12 < 0) {
        ishen_12 += 12;
      }
      var shiershenArr = ['青龙', '明堂', '天刑', '朱雀', '金匮', '天德', '白虎', '玉堂', '天牢', '玄武', '司命', '勾陈'];
      var shen_12 = shiershenArr[ishen_12];
      return shen_12;
    },
    getStemsBranchMonth: function (year, dayInYear) {
      var term = calendar.findPreTerm(year, dayInYear);
      var monthOffset = Math.floor((year - calendar.BASE_STEMS_YEAR) * 12 + (term + 2) / 2 - 2);
      var t = (monthOffset + 2) % 10;
      var b = (monthOffset + 2) % 12;
      return ((6 * t - 5 * b) + 60) % 60;
    },
    MIN: 1900, //最小年
    MAX: 2135, //最大年
    findPreTerm: function (year, dayInYear) {
      var index = year - calendar.MIN;
      if (index > 0 && index < TermTable.length / 24) {
        var begin = index * 24;
        return calendar.findPreTerm1(TermTable, dayInYear, begin);
      }
      return -1;
    },
    findPreTerm1: function (termTable, dayInYear, begin) {
      var value = new Array(24);
      for (var j = begin; j <= begin + 23; j++) {
        value[j - begin] = termTable[j];
      }
      var index = -1,
        i = 0;
      for (i = 0; i < value.length; i++) {
        if (dayInYear === value[i]) {
          index = i;
          break;
        }
        else if (dayInYear < value[i]) {
          index = i - 1;
          break;
        }
      }
      if (i === value.length && index === -1) {
        index = i - 1;
      }
      return index;
    },
		/**
		 * 获取伏天信息
		 */
    getDogDayInfo: function (dateObj) {
      var dogDays = calendar.getDogDaysBeginDates(dateObj.getFullYear());
      if (dogDays == null || dogDays.length < 3) {
        return '';
      }
      var DOG_FIRST_FORMATE = '初伏第';
      var DOG_SECOND_FORMATE = '中伏第';
      var DOG_THIRD_FORMATE = '末伏第';
      var interval1 = calendar.getIntervalDays(dogDays[0], dateObj);
      var interval2 = calendar.getIntervalDays(dogDays[1], dateObj);
      var interval3 = calendar.getIntervalDays(dogDays[2], dateObj);
      if (interval1 >= 0 && interval2 < 0) {
        return DOG_FIRST_FORMATE + (interval1 + 1) + '天';
      }
      else if (interval2 >= 0 && interval3 < 0) {
        return DOG_SECOND_FORMATE + (interval2 + 1) + '天';
      }
      else if (interval3 >= 0 && interval3 < 10) {
        return DOG_THIRD_FORMATE + (interval3 + 1) + '天';
      }
      return '';
    },
		/**
		 * 获取三伏开始时间
		 */
    getDogDaysBeginDates: function (year) {
      var offsetTerm = calendar.getOffsetByTerm(year, StemsBranch.TERMS_XZ);
      if (offsetTerm < 0) {
        return null;
      }
      var begindates = new Array(3);
      var termDate = calendar.getDateObjByOffset(year, offsetTerm);
      var baseDay = calendar.getStemsDay(termDate);
      begindates[0] = calendar.getNextDay(termDate, 20 + (baseDay > 6 ? 16 - baseDay : 6 - baseDay));
      begindates[1] = calendar.getNextDay(begindates[0], 10);
      offsetTerm = calendar.getOffsetByTerm(year, StemsBranch.TERMS_LQ);
      if (offsetTerm < 0) {
        return null;
      }
      termDate = calendar.getDateObjByOffset(year, offsetTerm);
      baseDay = calendar.getStemsDay(termDate);
      begindates[2] = calendar.getNextDay(termDate, (baseDay > 6) ? (16 - baseDay) : (6 - baseDay));
      return begindates;
    },
		/**
		 * 第n个节气的偏移日期 n从0开始
		 */
    getOffsetByTerm: function (year, n) {
      if (n < 0) {
        return -1;
      }
      return TermTable[(year - 1900) * 24 + n];
    },
		/**
		 * 干日
		 *
		 * @param date
		 * @return
		 */
    getStemsDay: function (date) {
      var dayOffset = calendar.getIntervalDays(calendar.BASE_STEMS_DATE, date);
      if (dayOffset > 0) {
        return Math.floor((dayOffset + 9) % 10);
      }
      return 0;
    },
    //根据年份和偏移日期获得data对象
    getDateObjByOffset: function (year, offset) {
      var dateObj = new Date(year, 0, 1, 0, 0, 0, 0);
      dateObj.setDate(dateObj.getDate() + offset);
      return dateObj;
    },
    //为指定日期添加天数
    getNextDay: function (dateObj, day) {
      let resultObj = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
      resultObj.setDate(resultObj.getDate() + day);
      return resultObj;
    },
    MIN_YEAR: 1900, //最小年
    MAX_YEAR: 2135, //最大年
    CHINESE_NUM: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
		/**
		 * 获取当前时间九九的信息
		 *
		 * @return
		 * @see [类',类#方法',类#成员]
		 */
    getColdInfo: function (dateObj) {
      var COLD_FORMATE = '九第';
      var daysInterval = calendar.getIntervalDays(calendar.getColdBeginDate(dateObj), dateObj);
      if (daysInterval >= 0) {
        var section = Math.floor((daysInterval / 9));
        var row = Math.floor(daysInterval % 9 + 1);
        if (section >= 0 && section < 9) {
          return calendar.CHINESE_NUM[section + 1] + COLD_FORMATE + row + '天';
        }
      }
      return '';
    },
		/**
		 * 获取九九的开始时间
		 *
		 * @return
		 * @see [类',类#方法',类#成员]
		 */
    getColdBeginDate: function (dateObj) {
      var year = dateObj.getFullYear();
      if (year >= calendar.MIN_YEAR && year <= calendar.MAX_YEAR) {
        var days = calendar.dayOfYear(dateObj);
        var offset = 0;
        if (days < 100) {
          offset = calendar.getOffsetByTerm(year - 1, StemsBranch.STEMS_DZ); // 23表示九九开始
          return calendar.getDateObjByOffset(year - 1, offset);
        }
        else {
          offset = calendar.getOffsetByTerm(year, StemsBranch.STEMS_DZ);
          return calendar.getDateObjByOffset(year, offset);
        }
      }
      return null;
    }
  };
  var StemsBranch = {
    'TERMS_XZ': 11,
    'TERMS_LQ': 14,
    'STEMS_DZ': 23
  };
  var TermTable = [
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //1900
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1901
    5, 20, 35, 49, 64, 79, 95, 110, 125, 141, 157, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1902
    5, 20, 35, 50, 65, 80, 95, 110, 126, 141, 157, 172, 188, 204, 220, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1903
    6, 20, 35, 50, 65, 80, 95, 110, 126, 141, 157, 173, 188, 204, 220, 235, 251, 266, 282, 297, 312, 327, 341, 356, //1904
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1905
    5, 20, 35, 49, 64, 79, 95, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1906
    5, 20, 35, 50, 65, 80, 95, 110, 126, 141, 157, 172, 188, 204, 220, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1907
    6, 20, 35, 50, 65, 80, 95, 110, 126, 141, 157, 173, 188, 204, 220, 235, 251, 266, 282, 297, 312, 327, 341, 356, //1908
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1909
    5, 20, 35, 49, 64, 79, 95, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1910
    5, 20, 35, 50, 65, 80, 95, 110, 126, 141, 157, 172, 188, 204, 220, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1911
    6, 20, 35, 50, 65, 80, 95, 110, 126, 141, 157, 173, 188, 204, 220, 235, 251, 266, 282, 297, 312, 326, 341, 356, //1912
    5, 19, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 341, 355, //1913
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1914
    5, 20, 35, 50, 64, 80, 95, 110, 125, 141, 157, 172, 188, 204, 219, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1915
    5, 20, 35, 50, 65, 80, 95, 110, 126, 141, 157, 173, 188, 204, 220, 235, 251, 266, 281, 297, 312, 326, 341, 356, //1916
    5, 19, 34, 49, 64, 79, 94, 110, 125, 140, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 341, 355, //1917
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1918
    5, 20, 35, 50, 64, 80, 95, 110, 125, 141, 157, 172, 188, 204, 219, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1919
    5, 20, 35, 50, 65, 80, 95, 110, 126, 141, 157, 173, 188, 204, 220, 235, 251, 266, 281, 297, 312, 326, 341, 356, //1920
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 340, 355, //1921
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1922
    5, 20, 35, 49, 64, 79, 95, 110, 125, 141, 157, 172, 188, 204, 219, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1923
    5, 20, 35, 50, 65, 80, 95, 110, 126, 141, 157, 173, 188, 204, 220, 235, 251, 266, 281, 297, 312, 326, 341, 356, //1924
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 340, 355, //1925
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1926
    5, 20, 35, 49, 64, 79, 95, 110, 125, 141, 157, 172, 188, 204, 219, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1927
    5, 20, 35, 50, 65, 80, 95, 110, 126, 141, 157, 173, 188, 204, 220, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1928
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //1929
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1930
    5, 20, 35, 49, 64, 79, 95, 110, 125, 141, 157, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1931
    5, 20, 35, 50, 65, 80, 95, 110, 126, 141, 157, 172, 188, 204, 220, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1932
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //1933
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1934
    5, 20, 35, 49, 64, 79, 95, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1935
    5, 20, 35, 50, 65, 80, 95, 110, 126, 141, 157, 172, 188, 204, 220, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1936
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //1937
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1938
    5, 20, 35, 49, 64, 79, 95, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1939
    5, 20, 35, 50, 65, 80, 95, 110, 126, 141, 157, 172, 188, 204, 220, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1940
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //1941
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1942
    5, 20, 35, 49, 64, 79, 95, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1943
    5, 20, 35, 50, 65, 80, 95, 110, 125, 141, 157, 172, 188, 204, 220, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1944
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //1945
    5, 19, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 341, 355, //1946
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1947
    5, 20, 35, 50, 64, 80, 95, 110, 125, 141, 157, 172, 188, 204, 219, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1948
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //1949
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 341, 355, //1950
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1951
    5, 20, 35, 50, 64, 80, 95, 110, 125, 141, 157, 172, 188, 204, 219, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1952
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //1953
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 340, 355, //1954
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1955
    5, 20, 35, 50, 64, 79, 95, 110, 125, 141, 157, 172, 188, 204, 219, 235, 251, 266, 281, 296, 311, 326, 341, 356, //1956
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //1957
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //1958
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1959
    5, 20, 35, 49, 64, 79, 95, 110, 125, 141, 157, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1960
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 295, 310, 325, 340, 355, //1961
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //1962
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1963
    5, 20, 35, 49, 64, 79, 95, 110, 125, 141, 157, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1964
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 295, 310, 325, 340, 355, //1965
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //1966
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1967
    5, 20, 35, 49, 64, 79, 95, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1968
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 295, 310, 325, 340, 355, //1969
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //1970
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1971
    5, 20, 35, 49, 64, 79, 95, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1972
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 295, 310, 325, 340, 355, //1973
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //1974
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 341, 355, //1975
    5, 20, 35, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1976
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //1977
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 280, 296, 311, 326, 340, 355, //1978
    5, 19, 34, 49, 64, 79, 94, 110, 125, 140, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 341, 355, //1979
    5, 20, 35, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 204, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1980
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //1981
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //1982
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 341, 355, //1983
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //1984
    4, 19, 34, 49, 63, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //1985
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //1986
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 235, 250, 265, 281, 296, 311, 326, 340, 355, //1987
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1988
    4, 19, 34, 49, 63, 78, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //1989
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //1990
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //1991
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1992
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //1993
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 295, 310, 325, 340, 355, //1994
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //1995
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //1996
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //1997
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 295, 310, 325, 340, 355, //1998
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //1999
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //2000
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2001
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2002
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //2003
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //2004
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2005
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2006
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //2007
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 341, 355, //2008
    4, 19, 34, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2009
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2010
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 280, 296, 311, 326, 340, 355, //2011
    5, 20, 34, 49, 64, 79, 94, 110, 125, 140, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 341, 355, //2012
    4, 19, 34, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2013
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2014
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //2015
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 341, 355, //2016
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2017
    4, 19, 34, 49, 63, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2018
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //2019
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 341, 355, //2020
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 354, //2021
    4, 19, 34, 49, 63, 78, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2022
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //2023
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //2024
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 354, //2025
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2026
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2027
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //2028
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 354, //2029
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2030
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2031
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //2032
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 354, //2033
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2034
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2035
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //2036
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 354, //2037
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2038
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2039
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //2040
    4, 19, 33, 48, 63, 78, 93, 109, 124, 139, 155, 171, 187, 202, 218, 234, 249, 264, 280, 295, 310, 325, 340, 354, //2041
    4, 19, 34, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2042
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2043
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 280, 296, 311, 326, 340, 355, //2044
    4, 19, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 187, 202, 218, 234, 249, 264, 280, 295, 310, 325, 340, 354, //2045
    4, 19, 34, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2046
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2047
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //2048
    4, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 233, 249, 264, 280, 295, 310, 325, 340, 354, //2049
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2050
    4, 19, 34, 49, 63, 78, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2051
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //2052
    4, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 233, 249, 264, 280, 295, 310, 325, 340, 354, //2053
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2054
    4, 19, 34, 49, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2055
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //2056
    4, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 233, 249, 264, 280, 295, 310, 325, 339, 354, //2057
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 354, //2058
    4, 19, 34, 49, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2059
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2060
    4, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 233, 249, 264, 280, 295, 310, 325, 339, 354, //2061
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 354, //2062
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2063
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2064
    4, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 233, 249, 264, 280, 295, 310, 325, 339, 354, //2065
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 354, //2066
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2067
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2068
    4, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 233, 249, 264, 280, 295, 310, 325, 339, 354, //2069
    4, 19, 33, 48, 63, 78, 93, 109, 124, 139, 155, 171, 187, 202, 218, 234, 249, 264, 280, 295, 310, 325, 340, 354, //2070
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2071
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2072
    4, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 233, 249, 264, 279, 295, 310, 325, 339, 354, //2073
    4, 19, 33, 48, 63, 78, 93, 109, 124, 139, 155, 171, 187, 202, 218, 234, 249, 264, 280, 295, 310, 325, 340, 354, //2074
    4, 19, 34, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2075
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2076
    4, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 233, 249, 264, 279, 295, 310, 325, 339, 354, //2077
    4, 19, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 234, 249, 264, 280, 295, 310, 325, 340, 354, //2078
    4, 19, 34, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2079
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2080
    4, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 170, 186, 202, 218, 233, 249, 264, 279, 295, 310, 324, 339, 354, //2081
    4, 19, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 233, 249, 264, 280, 295, 310, 325, 340, 354, //2082
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2083
    4, 19, 34, 49, 63, 78, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2084
    3, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 170, 186, 202, 218, 233, 249, 264, 279, 295, 310, 324, 339, 354, //2085
    4, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 233, 249, 264, 280, 295, 310, 325, 340, 354, //2086
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2087
    4, 19, 34, 49, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2088
    3, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 170, 186, 202, 218, 233, 249, 264, 279, 295, 310, 324, 339, 354, //2089
    4, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 233, 249, 264, 280, 295, 310, 325, 339, 354, //2090
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 354, //2091
    4, 19, 34, 49, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2092
    3, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 170, 186, 202, 218, 233, 249, 264, 279, 294, 309, 324, 339, 354, //2093
    4, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 233, 249, 264, 280, 295, 310, 325, 339, 354, //2094
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 354, //2095
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2096
    3, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 170, 186, 202, 217, 233, 249, 264, 279, 294, 309, 324, 339, 354, //2097
    4, 18, 33, 48, 63, 78, 93, 108, 124, 139, 155, 171, 186, 202, 218, 233, 249, 264, 280, 295, 310, 325, 339, 354, //2098
    4, 19, 33, 48, 63, 78, 93, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 354, //2099
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2100
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2101
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //2102
    5, 20, 34, 49, 64, 79, 94, 110, 125, 140, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 341, 355, //2103
    5, 20, 35, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //2104
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2105
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 280, 296, 311, 326, 340, 355, //2106
    5, 20, 34, 49, 64, 79, 94, 110, 125, 140, 156, 172, 187, 203, 219, 235, 250, 265, 281, 296, 311, 326, 341, 355, //2107
    5, 20, 35, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //2108
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2109
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 296, 311, 326, 340, 355, //2110
    5, 20, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 341, 355, //2111
    5, 20, 35, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //2112
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2113
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //2114
    5, 20, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 341, 355, //2115
    5, 20, 35, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //2116
    4, 19, 34, 49, 63, 79, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2117
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 296, 311, 325, 340, 355, //2118
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 341, 355, //2119
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 356, //2120
    4, 19, 34, 49, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2121
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 219, 234, 250, 265, 280, 295, 311, 325, 340, 355, //2122
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //2123
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //2124
    4, 19, 34, 49, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2125
    4, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2126
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //2127
    5, 20, 34, 49, 64, 79, 94, 110, 125, 141, 156, 172, 188, 203, 219, 235, 250, 266, 281, 296, 311, 326, 341, 355, //2128
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 203, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2129
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2130
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355, //2131
    5, 20, 34, 49, 64, 79, 94, 110, 125, 140, 156, 172, 188, 203, 219, 235, 250, 265, 281, 296, 311, 326, 341, 355, //2132
    4, 19, 34, 48, 63, 78, 94, 109, 124, 140, 155, 171, 187, 202, 218, 234, 249, 265, 280, 295, 310, 325, 340, 355, //2133
    4, 19, 34, 49, 64, 79, 94, 109, 124, 140, 156, 171, 187, 203, 218, 234, 250, 265, 280, 295, 310, 325, 340, 355, //2134
    5, 19, 34, 49, 64, 79, 94, 109, 125, 140, 156, 172, 187, 203, 219, 234, 250, 265, 281, 296, 311, 326, 340, 355 //2135
  ];
  return calendar;
})));