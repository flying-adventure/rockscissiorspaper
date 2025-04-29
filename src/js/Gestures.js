import { GestureDescription, Finger, FingerCurl } from 'fingerpose';

// 제스처 이름 정의
const RockGesture = new GestureDescription('rock'); // ✊ 바위
const PaperGesture = new GestureDescription('paper'); // 🤚 보
const ScissorsGesture = new GestureDescription('scissors'); // ✌ 가위

// 바위 (Rock) 제스처 설정
// -----------------------------------------------------------------------------

// 엄지: 반쯤 굽힘 (높은 신뢰도)
// 또는 완전히 펴진 상태도 조금 낮은 신뢰도로 허용
RockGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
RockGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// 나머지 손가락 (검지, 중지, 약지, 새끼손가락): 완전히 굽힘
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    RockGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    RockGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

// 보 (Paper) 제스처 설정
// -----------------------------------------------------------------------------

// 모든 손가락: 완전히 편 상태
for (let finger of Finger.all) {
    PaperGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

// 가위 (Scissors) 제스처 설정
// -----------------------------------------------------------------------------

// 검지와 중지: 완전히 편 상태
ScissorsGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
ScissorsGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);

// 약지: 완전히 굽힘 또는 반쯤 굽힘
ScissorsGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
ScissorsGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

// 새끼손가락: 완전히 굽힘 또는 반쯤 굽힘
ScissorsGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
ScissorsGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);

// 설정한 제스처들을 export
export {
    RockGesture, PaperGesture, ScissorsGesture
}
