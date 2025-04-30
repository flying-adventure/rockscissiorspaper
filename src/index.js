// 스타일 가져오기
import '@/styles/index.scss';

// 사운드 관련 import
import { Howl } from 'howler';
import clickSoundFile from './sounds/click.mp3';
import winSoundFile from './sounds/win.mp3';
import loseSoundFile from './sounds/lose.mp3';

// 사운드 객체 생성
const sounds = {
  click: new Howl({ src: [clickSoundFile], volume: 0.4 }),
  win: new Howl({ src: [winSoundFile], volume: 0.6 }),
  lose: new Howl({ src: [loseSoundFile], volume: 0.6 })
};

// 필요한 모듈 가져오기
import { UI } from '@/js/UI';
import { Prediction } from './js/Prediction';
import camConfig from '@/js/CameraConfig';

// 웹캠 비디오를 저장할 변수
var playerVideo;

// 게임 초기 설정 및 준비
async function onInit(nickname) {
    UI.init();
    UI.setPlayerNickname(nickname); // 닉네임을 UI에 표시
    UI.setRobotMessage(nickname);
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

// 닉네임 입력창 이벤트 처리
document.getElementById('start-btn').addEventListener('click', () => {
    const nicknameInput = document.getElementById('nickname');
    const nickname = nicknameInput.value.trim();

    if (nickname === "") {
        alert("닉네임을 입력해 주세요!");
        return;
    }

    document.querySelector('.nickname-input').style.display = 'none';
    sounds.click.play(); // 클릭 사운드 재생
    onInit(nickname);
});

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
                        const deltaTime = Date.now() - predictionStartTS;
                        gestureDuration += deltaTime;
                    }
                    else {
                        UI.setPlayerHand(playerGesture);
                        lastGesture = playerGesture;
                        gestureDuration = 0;
                    }
                }
                else {
                    UI.setPlayerHand(false);
                    lastGesture = "";
                    gestureDuration = 0;
                }

                if(gestureDuration < requiredDuration) {
                    UI.setTimerProgress(gestureDuration / requiredDuration);
                    predictNonblocking();
                }
                else {
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
            playerWins = computerGesture == "scissors";
        } else if (playerGesture == "paper") {
            playerWins = computerGesture == "rock";
        } else if (playerGesture == "scissors") {
            playerWins = computerGesture == "paper";
        }
        computerWins = !playerWins;
        
        statusText = playerWins ? "당신은 AI를 이겼습니다!" : "당신은 AI에게 졌습니다!";
        if (playerWins) sounds.win.play();
        else sounds.lose.play();
    }

    UI.showRobotHand(true);
    UI.setRobotGesture(computerGesture);
    UI.setStatusMessage(statusText);

    setTimeout(waitForPlayer, 3000);
}

// 컴퓨터 랜덤 제스처 선택
function getRandomGesture() {
    const gestures = ["rock", "paper", "scissors"];
    return gestures[Math.floor(Math.random() * gestures.length)];
}   