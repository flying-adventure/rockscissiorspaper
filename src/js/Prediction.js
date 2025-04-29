// handpose 모델 가져오기
import * as handpose from '@tensorflow-models/handpose';

// TensorFlow용 WebGL 백엔드 가져오기
// 참고: '@tensorflow/tfjs'에 기본 포함되어 있음
// (다른 백엔드로 교체하고 싶을 때를 대비해 명시적으로 import)
import '@tensorflow/tfjs-backend-webgl';

// FingerPose 제스처 인식기와 우리가 정의한 제스처들 가져오기
import { GestureEstimator } from 'fingerpose';
import { RockGesture, PaperGesture, ScissorsGesture } from './Gestures';

// 모델 워밍업에 사용할 샘플 이미지 가져오기
import { SampleImage } from './SampleImage';

// 모델과 제스처 인식기를 저장할 변수
let handposeModel, gestureEstimator;

// 제스처 예측 관련 기능 모듈
export const Prediction = {

    // 초기화 함수
    init: async function() {

        // 미리 정의한 제스처로 제스처 인식기 초기화
        const knownGestures = [RockGesture, PaperGesture, ScissorsGesture];
        gestureEstimator = new GestureEstimator(knownGestures);
        console.log('FingerPose 초기화 완료: ' + knownGestures.length + '개 제스처 등록');

        // Handpose 모델 로드
        console.log("Handpose 모델 로딩 중...");
        handposeModel = await handpose.load();
        console.log("모델 로딩 완료");

        // 샘플 이미지를 이용해 모델 워밍업 (초기 예측 한번 돌려서 느려지는 걸 방지)
        console.log("모델 워밍업 중");
        const sample = await SampleImage.create();
        await handposeModel.estimateHands(sample, false);
        console.log("모델 준비 완료!");
    },

    // 제스처 예측 함수
    predictGesture: async function(sourceElement, minimumScore) {

        // 입력 요소(sourceElement)에서 손 예측
        const predictions = await handposeModel.estimateHands(sourceElement, false);
    
        if (predictions.length > 0) {
    
            // 손 관절 좌표로 제스처 인식
            const gestureEstimations = gestureEstimator.estimate(
                predictions[0].landmarks, minimumScore
            );
    
            // 가장 높은 점수를 가진 제스처 선택
            if (gestureEstimations.gestures.length > 0) {
    
                // confidence(신뢰도)가 가장 높은 제스처 하나로 줄이기
                const gestureResult = gestureEstimations.gestures.reduce((p, c) => { 
                    return (p.confidence > c.confidence) ? p : c;
                });
    
                return gestureResult.name; // 인식된 제스처 이름 반환
            }
        }
    
        return ''; // 인식된 제스처가 없으면 빈 문자열 반환
    },

}
