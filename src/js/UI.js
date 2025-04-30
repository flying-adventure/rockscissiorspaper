// 필요한 요소 가져오기
const $playerVideo = document.querySelector('#player-video');
const $playerHand = document.querySelector('#player-hand');

const $robotImage = document.querySelector('#robot'); 
const $robotHand = document.querySelector('#robot-hand');

const $statusText = document.querySelector('#message');

const $timerRing = document.querySelector('#timer-ring');
const $timerRingCircle = document.querySelector('#timer-ring-circle');
const radius = $timerRingCircle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

// UI 관련 함수들을 모은 객체
export const UI = {

    // 초기화
    init: function() {
        this.initTimerCircle();
        this.showTimer(false);

        // 미리 이미지 로딩
        (new Image()).src = "assets/rock.png";
        (new Image()).src = "assets/paper.png";
        (new Image()).src = "assets/scissors.png";
    },
    setRobotMessage: function(nickname) {
        const $robotMessage = document.querySelector('#robot-message');
        if ($robotMessage) {
            $robotMessage.textContent = `안녕! ${nickname}!! 승부다!!`;
        }
    },

    // 타이머 원 초기 설정
    initTimerCircle: function() {
        $timerRingCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        $timerRingCircle.style.strokeDashoffset = `${circumference}`;
    },

    // 닉네임 설정
    setPlayerNickname: function(nickname) {
        const playerNickElement = document.getElementById('player-nick');
        playerNickElement.textContent = nickname;
    },

    // 상태 메시지 표시
    setStatusMessage: function(message) {
        $statusText.textContent = message;
    },
    
    // 메시지 깜빡이기 시작
    startAnimateMessage: function() {
        $statusText.classList.add("fade-in-out");
    },


    // 메시지 깜빡이기 중지
    stopAnimateMessage: function() {
        $statusText.classList.remove("fade-in-out");
    },
    
    // 카운트다운 시작
    startCountdown: async function() {
        return new Promise(resolve => {
            this.setStatusMessage("준비하세요!");
            setTimeout(() => { this.setStatusMessage("곧 시작합니다"); }, 1000);
            setTimeout(() => { this.setStatusMessage("손을 보여주세요!"); resolve(); }, 2000);
        });
    },

    // 타이머 원 표시/숨기기
    showTimer: function(show) {
        $timerRing.style.visibility = (show ? 'visible' : 'hidden');
    },

    // 타이머 진행 표시
    setTimerProgress: function(percent) {
        const offset = circumference - percent * circumference;
        $timerRingCircle.style.strokeDashoffset = offset;
    },

    // 플레이어 손 모양 표시
    setPlayerHand: function(gesture) {
        switch(gesture) {
            case 'rock': $playerHand.textContent = "✊"; break;
            case 'paper': $playerHand.textContent = "🤚"; break;
            case 'scissors': $playerHand.textContent = "✌"; break;
            default: $playerHand.textContent = ""; break;
        }
    },

    // 플레이어 손 애니메이션
    animatePlayerHand: function() {
        $playerHand.classList.add("player-hand-zoom");
        setTimeout(() => { $playerHand.classList.remove("player-hand-zoom"); }, 1000);
    },

    // 로봇 대기 이미지 표시
    showRobotImage: function(show) {
        $robotImage.style.display = (show ? 'block' : 'none');
        $robotHand.style.display = (show ? 'none' : 'block');
    },

    // 로봇 손 제스처 표시
    showRobotHand: function(show) {
        $robotHand.style.display = (show ? 'block' : 'none');
        $robotImage.style.display = (show ? 'none' : 'block');
    },

    // 로봇 손 모양 이미지 설정
    setRobotGesture: function(gesture) {
        if (!gesture) {
            // 아무 제스처가 없을 경우 기본 로봇 이미지
            $robotImage.src = "assets/robot.gif";
            $robotImage.style.display = 'block';
            $robotHand.style.display = 'none';
            return;
        }
    
        const gestureMap = {
            rock: 'assets/rock.png',
            paper: 'assets/paper.png',
            scissors: 'assets/scissors.png'
        };
    
        $robotHand.src = gestureMap[gesture];
        $robotHand.style.display = 'block';
        $robotImage.style.display = 'none';
    },
    

    // 플레이어 웹캠 열기
    initPlayerVideo: async function(constraints) {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        $playerVideo.srcObject = stream;
    
        return new Promise(resolve => {
            $playerVideo.onloadedmetadata = () => {
                $playerVideo.onloadeddata = () => {
                    resolve($playerVideo);
                };
            };
        });
    },

    // 모바일 디바이스 여부 확인
    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
}

