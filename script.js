const ctx = document.getElementById('exValChart').getContext('2d');
const exValChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['1%', '', '10%', '', '20%', '', '30%', '', '40%', '', '50%', '', '60%', '', '70%', '', '80%', '', '90%', '', '99%'], // x축 레이블 (확률)
        datasets: [{
            label: '기대값',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y축 데이터 (마릿수)
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)', // 선 아래 영역을 채울 색상
            fill: true // 선 아래 영역을 채우도록 설정
        }]        
    },
    options: {
        interaction: {
            mode: 'nearest',
            intersect: false,
            axis: 'x'
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                display: false // 레전드(라벨 표시) 숨기기
            },
            tooltip: {
                callbacks: {
                    // 모든 라벨을 숨기기
                    beforeLabel: function(tooltipItem, data) {
                        return null;
                    },
                    // 커스텀 툴팁 출력
                    label: function(context) {
                        const xIndex = context.dataIndex;
                        const probability = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99][xIndex]
                        const yValue = context.parsed.y;

                        // 두 줄의 라벨 생성
                        return [`상위: ${probability}%`, `기대값: ${yValue}마리`];
                    },
                    // 타이틀 숨기기
                    title: function(tooltipItem, data) {
                        return null;
                    }
                }
            }
        },
        scales: {
            x: { // X축 설정
                title: {
                    display: true, // X축 라벨 표시
                    text: '확률' // X축 라벨 내용
                }
            },
            y: { // Y축 설정
                title: {
                    display: true, // Y축 라벨 표시
                    text: '마릿수' // Y축 라벨 내용
                },
                beginAtZero: true, // Y축이 0부터 시작하도록 설정
                min: 0, // 최소값을 0으로 설정
            }
        }
    }    
});

let probablSucc = 0;
let limitTrial = 0;


document.getElementById("archerLv").addEventListener("focus", function() {
    document.getElementById("invaildArcherLv").style = "display:none";
    document.getElementById("archerLv").style = "border-bottom: 3px solid white;";
});
document.getElementById("monsterStar").addEventListener("focus", function() {
    document.getElementById("invaildMonsterStar").style = "display:none";
    document.getElementById("monsterStar").style = "border-bottom: 3px solid white;";
    document.getElementById("invaildMonsterType").style = "display:none";
});
document.getElementById("monsterLv").addEventListener("focus", function() {
    document.getElementById("invaildMonsterLv").style = "display:none";
    document.getElementById("monsterLv").style = "border-bottom: 3px solid white;";
});
document.getElementById("normalMonster").addEventListener("click", function() {
    document.getElementById("invaildMonsterType").style = "display:none";
});
document.getElementById("forceMonster").addEventListener("click", function() {
    document.getElementById("invaildMonsterType").style = "display:none";
});
document.getElementById("eliteMonster").addEventListener("click", function() {
    document.getElementById("invaildMonsterType").style = "display:none";
});
document.getElementById("bossMonster").addEventListener("click", function() {
    document.getElementById("invaildMonsterType").style = "display:none";
});


// 별 개수에 따른 몬스터 타입 가능 여부 [별 개수][일반몹,포스몹, 엘몹, 보스]
const vaildMonsterType = [[false, false, false, false], 
                        [true, false, false, false],
                        [true, true, false, true],
                        [true, false, true, true],
                        [false, false, true, true],
                        [false, false, false, true]];

document.getElementById("calculateButton").addEventListener("click", function() {
    const archerLv = parseInt(document.getElementById("archerLv").value);
    const doubleEventChk = document.querySelector('input[name="event"]:checked').value=="true";
    const specialPoint = parseInt(document.querySelector('input[name="specialPoint"]:checked').value);  // 0~3(일반, 포스, 엘몹, 보스)
    const monsterStar = parseInt(document.getElementById("monsterStar").value);
    const monsterLv = parseInt(document.getElementById("monsterLv").value);
    const monsterType = parseInt(document.querySelector('input[name="monsterType"]:checked').value);  // 0~3(일반, 포스, 엘몹, 보스)

    let invaildChk = false;
    if(isNaN(archerLv) || archerLv>6 || archerLv<0) {
        document.getElementById("invaildArcherLv").style = "display:block";
        document.getElementById("archerLv").style = "border-bottom: 3px solid #ee0000;";
        invaildChk = true;
    }
    if(isNaN(monsterLv) || monsterLv<1) {
        document.getElementById("invaildMonsterLv").style = "display:block";
        document.getElementById("monsterLv").style = "border-bottom: 3px solid #ee0000;";
        invaildChk = true;
    }
    if(isNaN(monsterStar) || monsterStar>5 || monsterStar<1) {
        document.getElementById("invaildMonsterStar").style = "display:block";
        document.getElementById("monsterStar").style = "border-bottom: 3px solid #ee0000;";
        invaildChk = true;
    }
    else if(!vaildMonsterType[monsterStar][monsterType]) {
        document.getElementById("invaildMonsterType").style = "display:block";
        document.getElementById("invaildMonsterType").innerText = monsterStar + "성 몬컬에는 " + ["일반몹", "포스몹", "엘몹", "보스"][monsterType] + "(이)가 없습니다!";
        invaildChk = true;
    }
    if(invaildChk) return;
    
    limitTrial = 0;
    if(monsterLv<=10) limitTrial = 100;
    else if(monsterLv<=20) limitTrial = 200;
    else if(monsterLv<=30) limitTrial = 240;
    else if(monsterLv<=50) limitTrial = 320;
    else if(monsterLv<=70) limitTrial = 500;
    else if(monsterLv<=100) limitTrial = 1650;
    else if(monsterLv<=120) limitTrial = 5000;
    else limitTrial = -1;

    const probability = calcProbability(archerLv, doubleEventChk, specialPoint, monsterStar, monsterLv, monsterType);
    let avgTrial;
    if(monsterLv<=120)  avgTrial = avgTrialCalc(probability, limitTrial);
    else avgTrial = 1/probability;
    avgTrial = (Math.floor(avgTrial*1000))/1000;
    if (!Number.isInteger(avgTrial)) avgTrial = Math.floor(avgTrial) + 1;

    probablSucc = probability;
    document.getElementById("limitTrial").innerText = "등록 천장: " + (limitTrial<0?"∞":limitTrial) + "마리";
    document.getElementById("avgTrial").innerText = "평균 시도 횟수: " + avgTrial + "마리";
    document.getElementById("exPro").value = Math.round(trialToProbability(probablSucc, avgTrial)*100000)/1000;
    document.getElementById("exTrial").value = avgTrial;
    drawChart(probability, limitTrial);
});

function avgTrialCalc(succPro, limitTrial) {
    let averageAttempts = 0;
    // 시그마 k=(1, 천장) k*((1-확률)^(k-1))*확률
    for (let k = 1; k <= limitTrial; k++) {
        averageAttempts += k * Math.pow(1 - succPro, k - 1) * succPro;
        console.log(averageAttempts);
    }
    console.log(averageAttempts, succPro, limitTrial);
    return averageAttempts;
}

function calcProbability(archerLv, doubleProb, specialPoint, mobStar, mobLv, mobType) {
    const addiProb = 100 + (100*doubleProb) + specialPoint + (5*archerLv + 5*(archerLv>0));  // 추가 확률(기본 100% + 선데이 2배 + 루시드 이벤트 포인트 + 모험가 궁수 링크)
    let probability = 0;
    if(mobType ==0) {  // 일반 몬스터
        if(mobLv<100) {
            probability = (mobStar+1)*(3**(mobStar-3))/mobLv;
        }
        else{
            probability = (10**(3*mobStar-2))/(mobLv**(mobStar+1));
        }
    }
    else if(mobType==1) {  // 포스 몬스터
        probability = 10/(mobLv**2);
    }
    else if(mobType==2) {  // 엘리트 몬스터 / 엘리트 보스
        probability = 4/9;
    }
    else if(mobType==3) {  // 보스 몬스터
        if(mobStar>=4) probability = 10/(mobStar*mobLv);
        else probability = 0.02;
    }
    probability = probability*(addiProb/100);
    // 출력
    document.getElementById("probability").innerText = Math.min(100, Math.round(probability*100000)/1000) + "%";
    return Math.min(1, probability);
}

// (성공확률, 트라이 횟수) -> 확률
function trialToProbability(n, trial) {
    return 1-((1-n)**trial);
}

// (성공확률, 상위%) -> 기대값
function probabilityToTrial(n, probability) {
    if(n>=1) return 1;
    let trial = Math.log(1-probability)/Math.log(1-n);
    trial = (Math.floor(trial*1000))/1000;
    if (Number.isInteger(trial)) {
        // 숫자가 정수인 경우 그대로 반환
        return trial;
    } else {
        // 숫자가 실수인 경우 소수점을 날리고 1을 더하여 반환
        return Math.floor(trial) + 1;
    }
}

function drawChart(probability) {
    // 각 확률별 기대 마릿수 계산
    let newYValues = [];
    if(limitTrial>0) newYValues.push(Math.min(limitTrial, probabilityToTrial(probability, 0.01)));
    else newYValues.push(probabilityToTrial(probability, 0.01));
    for(let i=1; i<=19; ++i) {
        if(limitTrial>0) newYValues.push(Math.min(limitTrial, probabilityToTrial(probability, 0.05*i)));
        else newYValues.push(probabilityToTrial(probability, 0.05*i));
    }
    if(limitTrial>0) newYValues.push(Math.min(limitTrial, probabilityToTrial(probability, 0.99)));
    else newYValues.push(probabilityToTrial(probability, 0.99));

    // 데이터셋 교체
    exValChart.data.datasets[0].data = newYValues;
    // 차트 업데이트
    exValChart.update();
}

document.getElementById("exPro").addEventListener("keyup", function() {
    if(probablSucc<=0) {  // 아직 확률 계산 전
        document.getElementById("exTrial").value = "";
        return;
    }
    const inputVal = document.getElementById("exPro").value;

    let numericValue; // 새로운 변수 선언

    // 숫자인지 체크
    if (!isNaN(inputVal) && inputVal.trim() !== "") {
        // 정규 표현식을 사용해 숫자만 있는지 확인 (정수 또는 실수)
        const regex = /^[+-]?(\d+\.?\d*|\.\d+)$/;
        if (regex.test(inputVal)) {
            numericValue = parseFloat(inputVal); // 숫자로 변환하여 저장
        }
    }

    // 선택적으로 새로운 변수의 값 확인
    if (numericValue !== undefined) {
        if(numericValue<=0 || numericValue>=100) { // 범위를 벗어남
            document.getElementById("exTrial").value = "";
            return;
        }
    }
    else {  // 입력값이 실수가 아님
        document.getElementById("exTrial").value = "";
        return;
    }

    // 계산값 표시
    if(limitTrial>0) document.getElementById("exTrial").value = Math.min(limitTrial, probabilityToTrial(probablSucc, numericValue/100));
    else document.getElementById("exTrial").value = probabilityToTrial(probablSucc, numericValue/100);
});

document.getElementById("exTrial").addEventListener("keyup", function() {
    if(probablSucc<=0) {  // 아직 확률 계산 전
        document.getElementById("exPro").value = "";
        return;
    }
    const inputVal = document.getElementById("exTrial").value;
    let integerValue; // 정수 값을 저장할 변수

    // 숫자인지 체크
    if (!isNaN(inputVal) && inputVal.trim() !== "") {
        // 정규 표현식을 사용해 정수인지 확인
        const regex = /^[+-]?\d+$/;
        if (regex.test(inputVal)) {
            integerValue = parseInt(inputVal, 10); // 문자열을 정수로 변환
        }
    }

    // 선택적으로 정수 변수의 값 확인
    if (integerValue == undefined) {
        document.getElementById("exPro").value = "";
        return;
    }

    // 계산값 표시
    if(limitTrial>0 && integerValue>limitTrial) document.getElementById("exPro").value = Math.round(trialToProbability(probablSucc, limitTrial)*100000)/1000;
    else document.getElementById("exPro").value = Math.round(trialToProbability(probablSucc, integerValue)*100000)/1000;
});
