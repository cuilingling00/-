// 保存请求回来的天气数据
let reqData = null;

const bannerWeatherImgMap = {
  晴: "./images/00.png",
  多云: "./images/01.png",
  阴: "./images/02.png",
  阴: "./images/02.png",
};

// var weaherTypeKeys = {
//     "00": "C2",
//     "01": "C9",
//     "02": "C1",
//     "03": "C3",
//     "04": "C3",
//     "05": "C3",
//     "06": "C3",
//     "07": "C3",
//     "08": "C3",
//     "09": "C3",
//     "10": "C3",
//     "11": "C3",
//     "12": "C3",
//     "13": "C4",
//     "14": "C4",
//     "15": "C4",
//     "16": "C4",
//     "17": "C4",
//     "18": "C5",
//     "19": "C3",
//     "20": "C7",
//     "21": "C3",
//     "22": "C3",
//     "23": "C3",
//     "24": "C3",
//     "25": "C3",
//     "26": "C4",
//     "27": "C4",
//     "28": "C4",
//     "29": "C7",
//     "30": "C7",
//     "31": "C7",
//     "53": "C6",
//     "99": "C8",
//     "32": "C5",
//     "49": "C5",
//     "54": "C6",
//     "55": "C6",
//     "56": "C6",
//     "57": "C5",
//     "58": "C5",
//     "301": "C3",
//     "302": "C4"
// };

renderChart();

$("#ct-hours .ct-page-ctrl #btn-next").click(function () {
  let curLeft = parseInt($("#ct-weather").css("marginLeft"));
  console.log(curLeft);
  $("#ct-weather").animate(
    {
      marginLeft: curLeft - 1100,
    },
    "fast"
  );
});

$("#ct-hours .ct-page-ctrl #btn-prev").click(function () {
  let curLeft = parseInt($("#ct-weather").css("marginLeft"));
  $("#ct-weather").animate(
    {
      marginLeft: curLeft >= 0 ? 0 : curLeft + 1100,
    },
    "fast"
  );
});

$("#ct-living-index .ct-page-ctrl #btn-next").click(function () {
  $("#ct-content").animate(
    {
      marginLeft: -440,
    },
    "fast"
  );
});

$("#ct-living-index .ct-page-ctrl #btn-prev").click(function () {
  $("#ct-content").animate(
    {
      marginLeft: 0,
    },
    "fast"
  );
});

// 根据ip获取定位信息
$.get(
  "https://restapi.amap.com/v3/ip",
  {
    key: "572781c0600add6b5c8d6a973f9afaf0",
  },
  function (data) {
    // 设置省份
    $("#province").text(data.province);
    // 设置城市
    $("#city").text(data.city);
    // 获取该城市的天气
    getWeather(data.province, data.city);
  }
);

// 根据定位城市查询天气
function getWeather(province, city) {
  $.ajax("https://wis.qq.com/weather/common", {
    dataType: "jsonp",
    data: {
      source: "pc",
      weather_type:
        "observe|forecast_1h|forecast_24h|index|alarm|limit|tips|rise|air",
      province: province,
      city: city,
    },
    success: function (data) {
      console.log(data);
      reqData = data.data;
      renderBanner(reqData);
      renderZxsyb(data.data.forecast_1h);
    },
  });
}

// 渲染banner区域
function renderBanner(data) {
  $("#txt-pub-time").text(
    `中央气象台${timeFormat(data.observe.update_time).time}发布`
  );
  $("#txt-temperature").text(data.observe.degree + "°");
  $("#txt-name").text(data.observe.weather);
  $(".info-aqi").text(`${data.air.aqi} ${data.air.aqi_name}`);
  $("#txt-wind").text(
    `${handleWindDirection(data.observe.wind_direction)} ${
      data.observe.wind_power
    }级`
  );
  $("#txt-humidity").text(`湿度 ${data.observe.humidity}%`);
  $("#txt-kPa").text(`气压 ${data.observe.pressure}hPa`);
  $("#txt-limit").text(`限行 ${data.limit.tail_number}`);
  $("#txt-tips").text(data.tips.observe[0]);
  $("#ct-current-weather img").attr(
    "src",
    bannerWeatherImgMap[$("#txt-name").html()]
  );
}

// 渲染逐小时预报区域
function renderZxsyb(data) {
  // 先清空\
  $("#ls-weather-hour").html("");

  for (let idx in data) {
    // 创建li
    let oLi = $(`
    <li class="item">
      <p class="txt-time">${timeFormat(data[idx].update_time).time}</p> 
      <img src="./images/${data[idx].weather}.png" alt="${
      data[idx].weather
    }" title="${data[idx].weather}" class="icon">
      <p class="txt-degree">${data[idx].degree}°</p>
    </li>`);

    // 将创建好的li添加到ol中
    $("#ls-weather-hour").append(oLi);
  }
}

// 切换tips
$("#btn-tip-switch").click(function () {
  if ($("#txt-tips").html() == reqData.tips.observe[0]) {
    $("#txt-tips").text(reqData.tips.observe[1]);
  } else if ($("#txt-tips").html() == reqData.tips.observe[1]) {
    $("#txt-tips").text(reqData.tips.observe[0]);
  }
});

// 渲染折线图
function renderChart() {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById("chart"));

  // 指定图表的配置项和数据
  var option = {
    backgroundColor: "rgba(0,0,0,0.0)",
    color: ["#FCC370", "#94CCF9"],
    animation: false,
    // renderAsImage: true,
    tooltip: {
      show: false,
    },
    xAxis: [
      {
        type: "category",
        show: false,
        data: [],
      },
    ],
    yAxis: [
      {
        type: "value",
        show: false,
        boundaryGap: ["45%", "45%"],
        scale: true,
      },
    ],
    grid: {
      x: 0,
      y: 0,
      y2: 0,
      height: 174,
      width: 740,
      borderWidth: "0px",
    },
    series: [
      {
        type: "line",
        data: [37, 34, 34, 36, 31, 36, 36, 30],
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        clipOverflow: false,
        lineStyle: {
          normal: {
            width: 3,
          },
        },
        label: {
          normal: {
            show: true,
            textStyle: {
              fontSize: "18",
              fontFamily: "微软雅黑",
              color: "#384C78",
            },
            distance: 10,
            formatter: function (val) {
              if (val.dataIndex == 0) {
                return `{first|${val.data}°}`;
              }
              return `${val.data}°`;
            },
            rich: {
              first: {
                fontSize: "18",
                fontFamily: "微软雅黑",
                color: "#C2C2C2",
              },
            },
          },
        },
      },
      {
        type: "line",
        data: [24, 20, 22, 21, 21, 23, 24, 20],
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          normal: {
            width: 3,
          },
        },
        label: {
          normal: {
            show: true,
            position: "bottom",
            textStyle: {
              fontSize: "18",
              fontFamily: "微软雅黑",
              color: "#555555",
            },
            distance: 10,
            formatter: function (val) {
              if (val.dataIndex == 0) {
                return `{first|${val.data}°}`;
              }
              return `${val.data}°`;
            },
            rich: {
              first: {
                fontSize: "18",
                fontFamily: "微软雅黑",
                color: "#C2C2C2",
              },
            },
          },
        },
      },
    ],
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}

// 处理时间
function timeFormat(timeStr) {
  let Y = timeStr.substr(0, 4);
  let M = timeStr.substr(4, 2);
  let D = timeStr.substr(6, 2);
  let H = timeStr.substr(8, 2);
  let m = timeStr.substr(10, 2);
  // console.log(Y, M, D, H, m);
  return {
    time: (function () {
      // 获取今天的日期
      let curD = new Date().getDate();

      if (D * 1 - curD == 1 && H == "00" && m == "00") {
        return "明天";
      } else if (D * 1 - curD == 2 && H == "00" && m == "00") {
        return "后天";
      } else {
        return H + ":" + m;
      }
    })(),
    date: M + "月" + D + "日",
  };
}

// 处理风向
function handleWindDirection(val) {
  switch (val) {
    case "0":
      return "无持续风向";
    case "1":
      return "东北风";
    case "2":
      return "东风";
    case "3":
      return "东南风";
    case "4":
      return "南风";
    case "5":
      return "西南风";
    case "6":
      return "西风";
    case "7":
      return "西北风";
    case "8":
      return "北风";
    case "9":
      return "旋转风";
    default:
      break;
  }
}
