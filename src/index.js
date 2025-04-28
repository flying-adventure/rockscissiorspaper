// 스타일 가져오기
import '@/styles/index.scss';

// 필요한 모듈 가져오기
import { UI } from '@/js/UI';
import { Prediction } from './js/Prediction';
import camConfig from '@/js/CameraConfig';

// 웹캠 비디오를 저장할 변수
var playerVideo;

// 게임 초기 설정 및 준비
async function onInit() {
    UI.init();
    UI.setStatusMessage("초기화 중 - 잠시만 기다려주세요");

    const videoPromise = UI.initPlayerVideo(camConfig);
    const predictPromise = Prediction.init();

    console.log("게임 초기화 중...");

    Promise.all([videoPromise, predictPromise])
    .then(result => {
        playerVideo = result[0];
        playerVideo.play();
        console.log("초기화 완료");

        waitForPlayer();
    });
}

// 플레이어 입력 대기
function waitForPlayer() {
    if(UI.isMobile()) {
        UI.setStatusMessage("화면을 터치하여 다음 게임을 시작하세요");
    } else {
        UI.setStatusMessage("아무 키나 눌러 다음 게임을 시작하세요");
    }

    UI.startAnimateMessage();

    const startGame = () => {
        UI.stopAnimateMessage();
        playOneRound();        
    };

    if(UI.isMobile()) {
        document.addEventListener('touchstart', startGame, { once: true }); 
    } else {
        window.addEventListener("keypress", startGame, { once: true });
    }    
}

// 한 판 게임 시작
async function playOneRound() {
    UI.showRobotImage(true);
    UI.showTimer(false);
    UI.setTimerProgress(0);
    UI.setPlayerHand("");

    await UI.startCountdown();
    
    UI.showTimer(true);
    detectPlayerGesture(150);
}

// 손 제스처 인식 및 결과 확인
function detectPlayerGesture(requiredDuration) {
    let lastGesture = "";
    let gestureDuration = 0;

    const predictNonblocking = () => {
        setTimeout(() => {
            const predictionStartTS = Date.now();

            Prediction.predictGesture(playerVideo, 9).then(playerGesture => {
                if(playerGesture != "") {
                    if(playerGesture == lastGesture) {
                        // 같은 제스처 유지 시 시간 누적
                        const deltaTime = Date.now() - predictionStartTS;
                        gestureDuration += deltaTime;
                    }
                    else {
                        // 새로운 제스처 인식 시 초기화
                        UI.setPlayerHand(playerGesture);
                        lastGesture = playerGesture;
                        gestureDuration = 0;
                    }
                }
                else {
                    // 제스처 없음
                    UI.setPlayerHand(false);
                    lastGesture = "";
                    gestureDuration = 0;
                }

                if(gestureDuration < requiredDuration) {
                    // 지속 시간이 부족하면 계속 측정
                    UI.setTimerProgress(gestureDuration / requiredDuration);
                    predictNonblocking();
                }
                else {
                    // 제스처 확정
                    UI.setTimerProgress(1);
                    UI.animatePlayerHand();
                    const computerGesture = getRandomGesture();
                    checkResult(playerGesture, computerGesture);
                }
            });
        }, 0);
    };

    predictNonblocking();
}

// 게임 결과 판정 및 메시지 표시
function checkResult(playerGesture, computerGesture) {
    let statusText;
    let playerWins = false;
    let computerWins = false;

    if (playerGesture == computerGesture) {
        statusText = "AI와 비겼습니다!";
    } else {
        if (playerGesture == "rock") {
            if (computerGesture == "scissors") {
                playerWins = true;
            } else {
                computerWins = true;
            }
        } else if (playerGesture == "paper") {
            if (computerGesture == "rock") {
                playerWins = true;
            } else {
                computerWins = true;
            }
        } else if (playerGesture == "scissors") {
            if (computerGesture == "paper") {
                playerWins = true;
            } else {
                computerWins = true;
            }
        }

        if (playerWins) {
            statusText = "당신은 AI를 이겼습니다!";
        } else if (computerWins) {
            statusText = "당신은 AI에게 졌습니다!";
        }
    }

    UI.showRobotHand(true);
    UI.setRobotGesture(computerGesture);
    UI.setStatusMessage(statusText);

    // 3초 후에 키 입력 대기 상태로 돌아가기
    setTimeout(waitForPlayer, 3000);
}

// 컴퓨터 랜덤 제스처 선택
function getRandomGesture() {
    const gestures = ["rock", "paper", "scissors"];
    const randomNum = Math.floor(Math.random() * gestures.length);
    return gestures[randomNum];
}

// 게임 실행 시작
onInit();