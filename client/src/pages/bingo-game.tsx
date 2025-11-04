import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCcw, Users, Bot, Check, Shuffle } from 'lucide-react';

// ============================================================
// 타입 정의
// ============================================================

interface KeywordData {
  keyword: string;
  description: string;
}

type GridSize = 3 | 4 | 5 | 6 | 7;
type GameMode = 'group' | 'solo';
type GameResult = 'player' | 'computer' | 'draw' | null;

// ============================================================
// 상수 정의
// ============================================================

/**
 * requiredLines: 빙고 성공에 필요한 줄 수
 * 
 * - 기본값: 3줄 (가로/세로/대각선 중 총 3줄 완성 시 승리)
 * - 이 값을 변경하면 난이도 조절 가능
 * - 진행도 UI (Progress: X / requiredLines)에 반영됨
 * - 모둠 모드: 레벨 완료 조건
 * - 혼자하기 모드: 승패 판정 조건
 */
const REQUIRED_LINES = 3;

// 연습용 키워드 (3×3)
const PRACTICE_KEYWORDS: KeywordData[] = [
  { keyword: '도담도담 정원', description: '작은 텃밭이나 정원을 가꾸며 자연과 함께 하는 실천입니다. 직접 키운 채소를 먹으면 탄소 발자국을 줄일 수 있어요.' },
  { keyword: '기후미식', description: '지역에서 생산된 제철 식재료를 활용한 요리로, 운송 과정의 탄소 배출을 최소화하는 식문화입니다.' },
  { keyword: '걷기운동', description: '짧은 거리는 차 대신 걸어서 이동하면 건강도 지키고 탄소 배출도 줄일 수 있어요.' },
  { keyword: '물병 챙기기', description: '개인 물병을 항상 가지고 다니면 일회용 플라스틱 컵 사용을 줄일 수 있습니다.' },
  { keyword: '장바구니', description: '마트나 시장 갈 때 장바구니를 챙기면 비닐봉지 사용을 줄일 수 있어요.' },
  { keyword: '절전 습관', description: '사용하지 않는 전기 제품의 플러그를 뽑고, 불필요한 조명을 끄는 습관입니다.' },
  { keyword: '손수건 사용', description: '화장지 대신 손수건을 사용하면 나무를 보호하고 쓰레기를 줄일 수 있어요.' },
  { keyword: '중고 거래', description: '필요 없는 물건을 나누고, 중고 제품을 활용하면 자원 낭비를 막을 수 있습니다.' },
  { keyword: '계단 이용', description: '엘리베이터 대신 계단을 이용하면 전기도 아끼고 건강도 챙길 수 있어요.' },
];

// 기후 키워드 (4×4 ~ 7×7)
const CLIMATE_KEYWORDS: KeywordData[] = [
  { keyword: '탄소중립', description: '온실가스 배출량을 최대한 줄이고, 남은 배출량은 흡수하여 실질적인 배출량을 0으로 만드는 것입니다.' },
  { keyword: '재활용', description: '사용한 물건을 다시 활용하여 쓰레기를 줄이고 자원을 아끼는 방법입니다.' },
  { keyword: '태양에너지', description: '태양의 빛과 열을 이용해 전기를 만드는 깨끗한 에너지입니다. 화석연료와 달리 오염물질이 나오지 않습니다.' },
  { keyword: '미세먼지', description: '대기 중에 떠다니는 아주 작은 먼지로, 건강에 해롭고 기후 변화에도 영향을 줍니다.' },
  { keyword: '해수면 상승', description: '지구 온난화로 빙하가 녹으면서 바다의 높이가 점점 높아지는 현상입니다.' },
  { keyword: '식물성 식단', description: '고기 대신 채소, 과일, 곡물 위주로 먹는 식습관으로 온실가스 배출을 크게 줄일 수 있습니다.' },
  { keyword: '온실가스', description: '이산화탄소 같은 가스들이 지구를 따뜻하게 만들어 기후 변화를 일으킵니다.' },
  { keyword: '전기차', description: '석유 대신 전기로 움직이는 자동차입니다. 배기가스가 없어서 공기를 깨끗하게 합니다.' },
  { keyword: '분리수거', description: '종이, 플라스틱, 유리 등을 따로 모아서 재활용할 수 있게 하는 것입니다.' },
  { keyword: '일회용품 줄이기', description: '한 번만 쓰고 버리는 물건 사용을 줄이면 쓰레기와 자원 낭비를 막을 수 있습니다.' },
  { keyword: '지구온난화', description: '지구의 평균 기온이 점점 높아지는 현상으로, 많은 환경 문제를 일으킵니다.' },
  { keyword: '풍력발전', description: '바람의 힘으로 터빈을 돌려 전기를 만드는 친환경 발전 방식입니다.' },
  { keyword: '생물다양성', description: '다양한 생물들이 함께 사는 것으로, 기후 변화로 많은 생물이 사라지고 있습니다.' },
  { keyword: '플라스틱 오염', description: '플라스틱은 자연에서 잘 분해되지 않아 환경을 오염시킵니다. 바다 생물들에게 특히 위험합니다.' },
  { keyword: '에너지 절약', description: '필요없는 전기를 끄고, 에너지 효율이 높은 제품을 사용하는 등 에너지를 아끼는 행동입니다.' },
  { keyword: '숲 보호', description: '나무들은 이산화탄소를 흡수해서 공기를 깨끗하게 만듭니다. 숲을 지키는 것이 중요합니다.' },
  { keyword: '대중교통', description: '버스, 지하철 같은 교통수단을 이용하면 자동차보다 환경 오염이 적습니다.' },
  { keyword: '물 절약', description: '물은 소중한 자원입니다. 양치할 때 컵을 사용하고, 샤워 시간을 줄이는 것이 좋습니다.' },
  { keyword: '친환경 제품', description: '만들 때부터 환경을 생각해서 만든 제품들입니다. 재활용 소재를 사용하기도 합니다.' },
  { keyword: '재생에너지', description: '태양광, 풍력, 수력 등 고갈되지 않고 재생 가능한 에너지원입니다.' },
  { keyword: '생태계', description: '생물들과 환경이 서로 영향을 주고받으며 살아가는 시스템입니다. 균형이 중요합니다.' },
  { keyword: '기후행동', description: '기후 위기를 막기 위해 우리가 할 수 있는 모든 실천 활동을 말합니다.' },
  { keyword: '지속가능성', description: '미래 세대도 좋은 환경에서 살 수 있도록 자원을 아껴 쓰는 것을 말합니다.' },
  { keyword: '순환경제', description: '자원을 재사용하고 재활용하여 폐기물을 최소화하는 경제 시스템입니다.' },
  { keyword: '그린리모델링', description: '건물을 에너지 효율적으로 개조하여 탄소 배출을 줄이는 것입니다.' },
  { keyword: '기후난민', description: '기후 변화로 인한 자연재해나 환경 악화로 고향을 떠나야 하는 사람들입니다.' },
  { keyword: '에너지 효율', description: '같은 에너지로 더 많은 일을 하거나, 적은 에너지로 같은 효과를 내는 것입니다.' },
  { keyword: '도시열섬', description: '도시 지역이 주변보다 온도가 높아지는 현상으로, 기후 변화를 가속화합니다.' },
  { keyword: '습지 보호', description: '습지는 탄소를 저장하고 생물다양성을 지키는 중요한 생태계입니다.' },
  { keyword: '산불 예방', description: '기후 변화로 산불이 증가하고 있습니다. 예방과 대응이 중요합니다.' },
  { keyword: '해양 쓰레기', description: '바다로 흘러들어간 플라스틱 등의 쓰레기가 해양 생태계를 파괴합니다.' },
  { keyword: '업사이클링', description: '버려지는 물건을 새롭고 가치 있는 제품으로 재탄생시키는 것입니다.' },
  { keyword: '탄소 발자국', description: '개인이나 조직이 활동하면서 배출하는 온실가스의 총량을 의미합니다.' },
  { keyword: '녹색 건축', description: '환경 친화적인 재료와 기술을 사용해 지속가능한 건물을 짓는 것입니다.' },
  { keyword: '제로 웨이스트', description: '쓰레기를 최소화하고 자원을 순환시키는 생활 방식입니다.' },
  { keyword: '로컬 푸드', description: '지역에서 생산된 식품을 소비하면 운송 거리가 줄어 탄소 배출이 감소합니다.' },
  { keyword: '기후 소송', description: '정부나 기업의 기후 대응 부족에 대해 법적 책임을 묻는 소송입니다.' },
  { keyword: '탄소 포집', description: '대기 중의 이산화탄소를 포집하여 저장하거나 활용하는 기술입니다.' },
  { keyword: '생태 복원', description: '훼손된 자연 생태계를 원래 상태로 되돌리는 작업입니다.' },
  { keyword: '기후 정의', description: '기후 위기의 영향을 공정하게 분담하고, 취약 계층을 보호하는 것입니다.' },
  { keyword: '녹색 전환', description: '화석연료 중심 경제에서 친환경 경제로 전환하는 과정입니다.' },
  { keyword: '환경 교육', description: '환경 문제를 이해하고 실천할 수 있도록 교육하는 것입니다.' },
  { keyword: '스마트 그리드', description: '전력 수요와 공급을 효율적으로 관리하는 지능형 전력망입니다.' },
  { keyword: '바이오 에너지', description: '식물이나 유기물을 에너지원으로 활용하는 재생 가능 에너지입니다.' },
  { keyword: '탄소 세', description: '탄소 배출에 세금을 부과하여 배출량을 줄이도록 유도하는 정책입니다.' },
  { keyword: '기후 적응', description: '기후 변화의 영향에 대비하고 적응하는 전략입니다.' },
  { keyword: '친환경 교통', description: '자전거, 전기차, 대중교통 등 환경에 미치는 영향이 적은 교통수단입니다.' },
  { keyword: '녹색 일자리', description: '환경 보호와 지속가능성에 기여하는 직업들입니다.' },
  { keyword: '기후 협약', description: '파리협정 등 국제사회가 기후 위기 대응을 위해 맺은 약속입니다.' },
];

// ============================================================
// 유틸리티 함수
// ============================================================

/**
 * 시드 기반 난수 생성기
 * @param seed 시드 문자열
 * @returns 0과 1 사이의 난수를 반환하는 함수
 */
function seededRandom(seed: string): () => number {
  let value = 0;
  for (let i = 0; i < seed.length; i++) {
    value = (value + seed.charCodeAt(i) * (i + 1)) % 2147483647;
  }
  
  return function() {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

/**
 * 시드 기반 배열 셔플
 * @param array 원본 배열
 * @param seed 시드 문자열
 * @returns 셔플된 새 배열
 */
function seededShuffle<T>(array: T[], seed: string): T[] {
  const newArray = [...array];
  const random = seededRandom(seed);
  
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * 새로운 시드 생성
 * @returns UUID + 타임스탬프 기반 고유 시드
 */
function generateNewSeed(): string {
  return `${crypto.randomUUID()}-${Date.now()}`;
}

/**
 * 보드 초기화 (buildBoard): 그리드 크기와 시드를 기반으로 키워드 배열 생성
 * 
 * DOM 생성 및 grid-template-columns 반영:
 * - 실제 DOM은 컴포넌트 렌더링에서 board.map()으로 생성 (정확히 size*size개)
 * - CSS는 style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}로 동적 반영
 * 
 * 단어 선택 로직 (pickWords):
 * - 3×3(연습): PRACTICE_KEYWORDS 사용
 * - 4×4~7×7: CLIMATE_KEYWORDS 사용
 * - 시드 셔플 → slice(0, size*size)로 정확한 개수 선택
 * - 단어 부족 시: 사용자에게 경고 메시지 표시
 * 
 * @param size 그리드 크기 (3~7)
 * @param seed 시드 문자열
 * @param wordArray 사용할 키워드 배열 (PRACTICE_KEYWORDS 또는 CLIMATE_KEYWORDS)
 * @returns 셔플된 키워드 데이터 배열 (정확히 size*size 개)
 */
function initBoard(size: GridSize, seed: string, wordArray: KeywordData[]): KeywordData[] {
  const totalCells = size * size;
  
  // 단어 부족 검사
  if (wordArray.length < totalCells) {
    const msg = `단어가 부족합니다!\n현재 ${wordArray.length}개 / 필요 ${totalCells}개\n\n${size}×${size} 그리드를 생성하려면 ${totalCells}개의 단어가 필요합니다.`;
    alert(msg);
    console.error(`Not enough keywords for ${size}x${size} grid. Need ${totalCells}, have ${wordArray.length}`);
  }
  
  // 시드 기반 셔플 후 정확히 size*size 개수만 선택
  return seededShuffle(wordArray, `${seed}-${size}`).slice(0, totalCells);
}

/**
 * 모둠 모드 전용 보드 초기화: 같은 단어, 다른 배열
 * 
 * 모둠 빙고 특성:
 * - 모든 플레이어가 같은 단어 세트를 공유 (한 사람이 부른 단어를 모두가 가지고 있음)
 * - 하지만 각자 배열이 다름 (빙고 완성 위치가 달라서 경쟁 가능)
 * 
 * @param size 그리드 크기
 * @param wordArray 전체 키워드 배열
 * @param randomSeed 각 세션별 랜덤 시드 (배열 순서 결정)
 * @returns 셔플된 키워드 데이터 배열
 */
function initGroupBoard(size: GridSize, wordArray: KeywordData[], randomSeed: string): KeywordData[] {
  const totalCells = size * size;
  
  // 레벨별로 같은 단어 세트 사용 (앞에서부터 필요한 개수만큼)
  const fixedWordSet = wordArray.slice(0, totalCells);
  
  // 각 세션마다 다른 배열로 셔플
  return seededShuffle(fixedWordSet, randomSeed);
}

/**
 * 완성된 빙고 줄 계산 (getCompletedLines): 동적 size 기반 가로/세로/대각선 판정
 * 
 * 빙고 판정 로직:
 * - 동적 size를 기준으로 모든 줄 검사
 * - 행(row): i * size + j (각 행은 size개의 연속된 타일)
 * - 열(col): j * size + i (각 열은 size 간격으로 떨어진 타일)
 * - 대각선1 (↘): i * size + i (0, size+1, 2*size+2, ...)
 * - 대각선2 (↙): i * size + (size - 1 - i)
 * 
 * 중복 방지:
 * - 이미 완성된 줄은 배열에 한 번만 포함 (Set이 아닌 배열 반환이지만 중복 체크는 호출자가 관리)
 * 
 * @param selected 선택된 타일의 인덱스 Set
 * @param size 그리드 크기 (동적으로 3~7 가능)
 * @returns 완성된 줄들의 배열 (각 줄은 인덱스 배열)
 */
function getCompletedLines(selected: Set<number>, size: GridSize): number[][] {
  const lines: number[][] = [];
  
  // 모든 행 검사 (가로줄)
  for (let i = 0; i < size; i++) {
    const row = Array.from({ length: size }, (_, j) => i * size + j);
    if (row.every(idx => selected.has(idx))) {
      lines.push(row);
    }
  }
  
  // 모든 열 검사 (세로줄)
  for (let i = 0; i < size; i++) {
    const col = Array.from({ length: size }, (_, j) => j * size + i);
    if (col.every(idx => selected.has(idx))) {
      lines.push(col);
    }
  }
  
  // 왼쪽 위 → 오른쪽 아래 대각선 (↘)
  const diagonal1 = Array.from({ length: size }, (_, i) => i * size + i);
  if (diagonal1.every(idx => selected.has(idx))) {
    lines.push(diagonal1);
  }
  
  // 오른쪽 위 → 왼쪽 아래 대각선 (↙)
  const diagonal2 = Array.from({ length: size }, (_, i) => i * size + (size - 1 - i));
  if (diagonal2.every(idx => selected.has(idx))) {
    lines.push(diagonal2);
  }

  return lines;
}

/**
 * 보드에서 특정 단어가 있는 인덱스를 찾아 마킹
 * @param board 보드 데이터 배열
 * @param word 찾을 단어
 * @param selected 현재 선택된 타일 Set
 * @returns 마킹된 인덱스 배열
 */
function markIfExists(board: KeywordData[], word: string, selected: Set<number>): number[] {
  const marked: number[] = [];
  board.forEach((data, idx) => {
    if (data.keyword === word && !selected.has(idx)) {
      marked.push(idx);
    }
  });
  return marked;
}

// ============================================================
// 메인 컴포넌트
// ============================================================

export default function BingoGame() {
  // 공통 상태
  const [gameMode, setGameMode] = useState<GameMode>('group');
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTile, setCurrentTile] = useState<KeywordData | null>(null);

  // 모둠 모드 상태 (기존 로직)
  const [level, setLevel] = useState<number>(1);
  const [groupBoard, setGroupBoard] = useState<KeywordData[]>([]);
  const [groupSelected, setGroupSelected] = useState<Set<number>>(new Set());
  const [groupSeed, setGroupSeed] = useState<string>('');
  const [hasBingo, setHasBingo] = useState(false);
  const [winningLines, setWinningLines] = useState<number[][]>([]);
  const [levelCompleteModalOpen, setLevelCompleteModalOpen] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [completedLinesCount, setCompletedLinesCount] = useState<number>(0);

  // 혼자하기 모드 상태
  const [playerBoard, setPlayerBoard] = useState<KeywordData[]>([]);
  const [computerBoard, setComputerBoard] = useState<KeywordData[]>([]);
  const [playerSelected, setPlayerSelected] = useState<Set<number>>(new Set());
  const [computerSelected, setComputerSelected] = useState<Set<number>>(new Set());
  const [drawnWords, setDrawnWords] = useState<Set<string>>(new Set());
  const [currentDrawnWord, setCurrentDrawnWord] = useState<KeywordData | null>(null);
  const [playerLines, setPlayerLines] = useState<number>(0);
  const [computerLines, setComputerLines] = useState<number>(0);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  /**
   * 초기화 Effect: gameMode, gridSize, 또는 level 변경 시 실행 (onSizeChange)
   * 
   * size 변경 시 초기화 절차:
   * 1. 보드/선택상태/진행도/완성 줄 집합 완전 초기화
   * 2. 새로운 시드로 보드 재생성
   * 3. UI 즉시 갱신 (grid-template-columns도 자동 반영)
   * 
   * level 변경 시 (Group 모드):
   * - level이 변경되면 그리드 크기도 변경되므로 보드 재생성 필요
   */
  useEffect(() => {
    if (gameMode === 'group') {
      initGroupMode();
    } else {
      initSoloMode();
    }
  }, [gameMode, gridSize, level]);

  /**
   * 모둠 모드 초기화 (resetGame for Group Mode)
   * 
   * 초기화 절차:
   * - 레벨별 같은 단어 세트 사용 (모든 플레이어가 같은 단어 공유)
   * - 하지만 각 세션마다 다른 배열 (랜덤 시드)
   * - 선택상태, 진행도, 완성 줄 모두 초기화
   * - level에 따라 그리드 크기 결정 (level+2)
   * - 3×3은 PRACTICE_KEYWORDS, 4×4~7×7은 CLIMATE_KEYWORDS 사용
   * 
   * 중요: 모둠 빙고는 여러 사람이 함께 하므로 같은 레벨에서는
   *       같은 단어 세트를 공유하지만, 배열은 각자 달라야 합니다.
   */
  const initGroupMode = () => {
    // 세션별 랜덤 시드 (배열 순서 다르게)
    const seed = generateNewSeed();
    setGroupSeed(seed);
    const size = (level + 2) as GridSize;
    const sourceArray = size === 3 ? PRACTICE_KEYWORDS : CLIMATE_KEYWORDS;
    const board = initGroupBoard(size, sourceArray, seed);
    setGroupBoard(board);
    setGroupSelected(new Set());
    setHasBingo(false);
    setWinningLines([]);
    setCompletedLinesCount(0);
  };

  /**
   * 혼자하기 모드 초기화 (resetGame for Solo Mode)
   * 
   * 초기화 절차:
   * - 플레이어/컴퓨터 각각 다른 시드로 보드 생성
   * - 선택상태, 뽑은 단어, 진행도, 게임 결과 모두 초기화
   * - gridSize에 따라 그리드 크기 결정 (사용자 선택)
   * - 3×3은 PRACTICE_KEYWORDS, 4×4~7×7은 CLIMATE_KEYWORDS 사용
   */
  const initSoloMode = () => {
    const playerSeed = generateNewSeed();
    const computerSeed = generateNewSeed();
    const sourceArray = gridSize === 3 ? PRACTICE_KEYWORDS : CLIMATE_KEYWORDS;
    
    setPlayerBoard(initBoard(gridSize, playerSeed, sourceArray));
    setComputerBoard(initBoard(gridSize, computerSeed, sourceArray));
    setPlayerSelected(new Set());
    setComputerSelected(new Set());
    setDrawnWords(new Set());
    setCurrentDrawnWord(null);
    setPlayerLines(0);
    setComputerLines(0);
    setGameResult(null);
    setResultModalOpen(false);
  };

  // 모둠 모드: 타일 클릭 핸들러 (체크 토글 기능 포함)
  const handleGroupTileClick = (index: number, data: KeywordData) => {
    if (allLevelsComplete) return;
    
    const newSelected = new Set(groupSelected);
    
    // 이미 선택된 타일 클릭 시 선택 해제 (체크 취소)
    if (groupSelected.has(index)) {
      // 빙고 완성 후에는 취소 불가
      if (hasBingo) {
        return;
      }
      newSelected.delete(index);
      setGroupSelected(newSelected);
      
      // 줄 수 재계산
      const completedLines = getCompletedLines(newSelected, (level + 2) as GridSize);
      setCompletedLinesCount(completedLines.length);
      setWinningLines(completedLines);
      return;
    }
    
    // 새로 선택
    newSelected.add(index);
    setGroupSelected(newSelected);
    
    setCurrentTile(data);
    setModalOpen(true);
    
    const completedLines = getCompletedLines(newSelected, (level + 2) as GridSize);
    const linesCount = completedLines.length;
    
    setCompletedLinesCount(linesCount);
    setWinningLines(completedLines);
    
    if (linesCount >= REQUIRED_LINES && !hasBingo) {
      setHasBingo(true);
    }
  };
  
  // 키워드 모달 닫기 핸들러
  const handleCloseKeywordModal = () => {
    setModalOpen(false);
    // 빙고 완성 상태이면 레벨 완료 모달 열기
    if (hasBingo) {
      setTimeout(() => {
        setLevelCompleteModalOpen(true);
      }, 300);
    }
  };

  // 혼자하기 모드: 단어 뽑기
  const handleDrawWord = () => {
    if (gameResult) return;
    
    const sourceArray = gridSize === 3 ? PRACTICE_KEYWORDS : CLIMATE_KEYWORDS;
    const availableWords = sourceArray.filter(w => !drawnWords.has(w.keyword));
    
    if (availableWords.length === 0) {
      alert('모든 단어를 다 뽑았습니다!');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const drawnWord = availableWords[randomIndex];
    
    setCurrentDrawnWord(drawnWord);
    const newDrawnWords = new Set(Array.from(drawnWords));
    newDrawnWords.add(drawnWord.keyword);
    setDrawnWords(newDrawnWords);
    
    // 플레이어 보드에서 해당 단어 찾아서 마킹
    const playerMarked = markIfExists(playerBoard, drawnWord.keyword, playerSelected);
    const newPlayerSelected = new Set(playerSelected);
    playerMarked.forEach(idx => newPlayerSelected.add(idx));
    setPlayerSelected(newPlayerSelected);
    
    // 컴퓨터 보드에서 해당 단어 찾아서 마킹
    const computerMarked = markIfExists(computerBoard, drawnWord.keyword, computerSelected);
    const newComputerSelected = new Set(computerSelected);
    computerMarked.forEach(idx => newComputerSelected.add(idx));
    setComputerSelected(newComputerSelected);
    
    // 완성된 줄 수 계산
    const playerCompletedLines = getCompletedLines(newPlayerSelected, gridSize);
    const computerCompletedLines = getCompletedLines(newComputerSelected, gridSize);
    
    setPlayerLines(playerCompletedLines.length);
    setComputerLines(computerCompletedLines.length);
    
    // 승패 판정
    const playerWon = playerCompletedLines.length >= REQUIRED_LINES;
    const computerWon = computerCompletedLines.length >= REQUIRED_LINES;
    
    if (playerWon && computerWon) {
      setGameResult('draw');
      setTimeout(() => setResultModalOpen(true), 500);
    } else if (playerWon) {
      setGameResult('player');
      setTimeout(() => setResultModalOpen(true), 500);
    } else if (computerWon) {
      setGameResult('computer');
      setTimeout(() => setResultModalOpen(true), 500);
    }
  };

  // 모둠 모드: 다음 레벨
  const handleNextLevel = () => {
    setLevelCompleteModalOpen(false);
    
    if (level >= 5) {
      setAllLevelsComplete(true);
      return;
    }
    
    setLevel(level + 1);
    setHasBingo(false);
  };

  /**
   * 리셋 핸들러 (resetGame)
   * 
   * Group 모드:
   * - level을 1로 재설정 (useEffect가 initGroupMode 자동 호출)
   * - 완료 상태 초기화
   * 
   * Solo 모드:
   * - 직접 initSoloMode 호출하여 모든 상태 초기화
   */
  const handleReset = () => {
    if (confirm('처음부터 다시 시작하시겠습니까?')) {
      if (gameMode === 'group') {
        setLevel(1);
        setAllLevelsComplete(false);
        setLevelCompleteModalOpen(false);
        // level 변경 시 useEffect가 initGroupMode 자동 호출
      } else {
        initSoloMode();
      }
    }
  };

  // 그리드 크기 선택
  const handleGridSizeChange = (size: GridSize) => {
    setGridSize(size);
  };

  // 모드 변경
  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
  };

  // 유틸리티 함수들
  const isWinningTile = (index: number): boolean => {
    return winningLines.some(line => line.includes(index));
  };

  const getLevelName = (lv: number): string => {
    const names = ['연습 단계', '초급 지킴이', '중급 지킴이', '상급 지킴이', '마스터 지킴이'];
    return names[lv - 1] || '';
  };

  const getLevelCompleteMessage = (lv: number): { title: string; message: string } => {
    const messages = [
      { title: '연습 완료!', message: '기본기를 익혔습니다. 이제 본격적인 도전을 시작해볼까요?' },
      { title: '초급 달성!', message: '훌륭합니다! 기후 지식이 자라나고 있어요.' },
      { title: '중급 달성!', message: '대단해요! 이제 진정한 기후 지킴이의 모습이 보입니다.' },
      { title: '상급 달성!', message: '놀라워요! 거의 전문가 수준이에요. 마지막 도전만 남았습니다!' },
      { title: '환경지킴이 인증', message: '축하합니다! 모든 단계를 완료하셨습니다. 당신은 이제 진정한 환경지킴이입니다!' }
    ];
    return messages[lv - 1] || messages[0];
  };

  const getTileSize = (size: GridSize) => {
    switch(size) {
      case 3: return 'text-xs sm:text-sm md:text-base';
      case 4: return 'text-[0.7rem] sm:text-xs md:text-sm';
      case 5: return 'text-[0.65rem] sm:text-xs md:text-sm';
      case 6: return 'text-[0.6rem] sm:text-[0.7rem] md:text-xs';
      case 7: return 'text-[0.55rem] sm:text-[0.65rem] md:text-xs';
      default: return 'text-xs sm:text-sm md:text-base';
    }
  };

  const getResultMessage = (): { title: string; message: string } => {
    if (gameResult === 'player') {
      return { title: '플레이어 승리!', message: '축하합니다! 컴퓨터를 이겼습니다!' };
    } else if (gameResult === 'computer') {
      return { title: '컴퓨터 승리', message: '아쉽네요. 다시 도전해보세요!' };
    } else {
      return { title: '무승부!', message: '동시에 빙고를 완성했습니다!' };
    }
  };

  // ============================================================
  // 렌더링
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-primary/10 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
            기후 위기 빙고 챌린지
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            {gameMode === 'group' 
              ? '3×3부터 7×7까지 모든 빙고를 완성하여 지구 지킴이 등단에 도전하세요!'
              : '컴퓨터와 대결하여 먼저 3줄을 완성하세요!'}
          </p>
        </header>

        {/* 모드 선택 */}
        <div className="mb-6">
          <Tabs value={gameMode} onValueChange={(v) => handleModeChange(v as GameMode)}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="group" className="gap-2" data-testid="mode-group">
                <Users className="w-4 h-4" />
                모둠 모드
              </TabsTrigger>
              <TabsTrigger value="solo" className="gap-2" data-testid="mode-solo">
                <Bot className="w-4 h-4" />
                혼자하기
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 혼자하기 모드: 그리드 크기 선택 */}
        {gameMode === 'solo' && (
          <div className="mb-6">
            <div className="bg-card/90 backdrop-blur-sm p-4 rounded-lg border border-card-border shadow-md">
              <p className="text-sm font-medium text-muted-foreground mb-3 text-center">그리드 크기 선택</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {[3, 4, 5, 6, 7].map((size) => (
                  <Button
                    key={size}
                    variant={gridSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleGridSizeChange(size as GridSize)}
                    data-testid={`grid-size-${size}`}
                    className="min-w-[4rem]"
                  >
                    {size}×{size}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 모둠 모드 렌더링 */}
        {gameMode === 'group' && (
          <GroupModeUI
            level={level}
            gridSize={(level + 2) as GridSize}
            board={groupBoard}
            selected={groupSelected}
            completedLinesCount={completedLinesCount}
            hasBingo={hasBingo}
            allLevelsComplete={allLevelsComplete}
            winningLines={winningLines}
            onTileClick={handleGroupTileClick}
            onReset={handleReset}
            getLevelName={getLevelName}
            getTileSize={getTileSize}
            isWinningTile={isWinningTile}
          />
        )}

        {/* 혼자하기 모드 렌더링 */}
        {gameMode === 'solo' && (
          <SoloModeUI
            gridSize={gridSize}
            playerBoard={playerBoard}
            computerBoard={computerBoard}
            playerSelected={playerSelected}
            computerSelected={computerSelected}
            playerLines={playerLines}
            computerLines={computerLines}
            currentDrawnWord={currentDrawnWord}
            gameResult={gameResult}
            onDrawWord={handleDrawWord}
            onReset={handleReset}
            getTileSize={getTileSize}
          />
        )}

        <footer className="text-center mt-6 sm:mt-8">
          <p className="text-base sm:text-lg md:text-xl font-medium text-primary">
            지구를 지키는 작은 실천을 시작해요
          </p>
        </footer>
      </div>

      {/* 키워드 상세 모달 */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent data-testid="keyword-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              {currentTile?.keyword}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base text-foreground leading-relaxed py-4">
            {currentTile?.description}
          </DialogDescription>
          <Button 
            onClick={handleCloseKeywordModal} 
            size="lg" 
            className="w-full font-bold text-lg"
            data-testid="button-modal-close"
          >
            알겠어요!
          </Button>
        </DialogContent>
      </Dialog>

      {/* 모둠 모드: 레벨 완료 모달 */}
      <Dialog open={levelCompleteModalOpen} onOpenChange={setLevelCompleteModalOpen}>
        <DialogContent data-testid="level-complete-modal">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-primary text-center">
              {getLevelCompleteMessage(level).title}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-lg text-foreground text-center py-4">
            {getLevelCompleteMessage(level).message}
          </DialogDescription>
          <Button 
            onClick={handleNextLevel} 
            size="lg" 
            className="w-full font-bold text-lg"
            data-testid="button-next-level"
          >
            {level >= 5 ? '완료!' : '다음 단계로'}
          </Button>
        </DialogContent>
      </Dialog>

      {/* 혼자하기 모드: 게임 결과 모달 */}
      <Dialog open={resultModalOpen} onOpenChange={setResultModalOpen}>
        <DialogContent data-testid="result-modal">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-primary text-center">
              {getResultMessage().title}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-lg text-foreground text-center py-4">
            {getResultMessage().message}
          </DialogDescription>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setResultModalOpen(false);
                initSoloMode();
              }} 
              size="lg" 
              className="flex-1 font-bold"
              data-testid="button-play-again"
            >
              다시 하기
            </Button>
            <Button 
              onClick={() => setResultModalOpen(false)} 
              size="lg" 
              variant="outline"
              className="flex-1 font-bold"
              data-testid="button-close-result"
            >
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 모둠 모드 UI
// ============================================================

interface GroupModeUIProps {
  level: number;
  gridSize: GridSize;
  board: KeywordData[];
  selected: Set<number>;
  completedLinesCount: number;
  hasBingo: boolean;
  allLevelsComplete: boolean;
  winningLines: number[][];
  onTileClick: (index: number, data: KeywordData) => void;
  onReset: () => void;
  getLevelName: (lv: number) => string;
  getTileSize: (size: GridSize) => string;
  isWinningTile: (index: number) => boolean;
}

function GroupModeUI({
  level,
  gridSize,
  board,
  selected,
  completedLinesCount,
  hasBingo,
  allLevelsComplete,
  winningLines,
  onTileClick,
  onReset,
  getLevelName,
  getTileSize,
  isWinningTile,
}: GroupModeUIProps) {
  return (
    <>
      {allLevelsComplete ? (
        <div 
          className="bg-gradient-to-r from-primary via-accent to-secondary p-6 sm:p-8 rounded-xl shadow-2xl mb-6"
          data-testid="all-complete-banner"
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">
              지구 지킴이 등단
            </h2>
            <p className="text-lg sm:text-xl text-white/90 text-center">
              모든 단계를 완료하셨습니다!<br />당신은 진정한 기후 영웅입니다!
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="bg-card/90 backdrop-blur-sm p-4 rounded-lg border border-card-border shadow-md">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default" className="text-base font-bold px-3 py-1">
                    {getLevelName(level)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {gridSize}×{gridSize} 그리드
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {level === 1 ? '연습 단계로 시작합니다' : `레벨 ${level}/5 진행 중`}
                  </p>
                  <Badge 
                    variant={completedLinesCount >= REQUIRED_LINES ? "default" : "secondary"}
                    className="text-sm font-bold px-2 py-0.5"
                    data-testid="progress-badge"
                  >
                    진행도: {completedLinesCount} / {REQUIRED_LINES}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(lv => (
                  <div
                    key={lv}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 ${
                      lv < level
                        ? 'bg-primary text-primary-foreground border-primary'
                        : lv === level
                        ? 'bg-accent text-accent-foreground border-accent animate-pulse'
                        : 'bg-muted text-muted-foreground border-muted'
                    }`}
                    data-testid={`level-indicator-${lv}`}
                  >
                    {lv < level ? '✓' : lv}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {hasBingo && !allLevelsComplete && (
        <div 
          className="bg-gradient-to-r from-primary via-accent to-secondary p-4 sm:p-6 rounded-lg shadow-lg mb-6"
          data-testid="victory-banner"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center">
            빙고 완성!
          </h2>
        </div>
      )}

      <div className="bg-card/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-xl border border-card-border">
        <div 
          className="grid gap-1.5 sm:gap-2 md:gap-3 mb-6"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
          data-testid="bingo-grid"
        >
          {board.map((data, index) => {
            const isSelected = selected.has(index);
            const isWinning = isWinningTile(index);
            
            return (
              <button
                key={index}
                onClick={() => onTileClick(index, data)}
                data-testid={`tile-${index}`}
                className={`
                  relative aspect-square rounded-xl sm:rounded-2xl p-1.5 sm:p-2 md:p-3
                  flex items-center justify-center text-center
                  ${getTileSize(gridSize)} font-bold leading-tight
                  transition-all duration-200 border-2
                  ${isSelected 
                    ? isWinning
                      ? 'bg-gradient-to-br from-primary via-accent to-secondary text-white border-primary shadow-lg scale-105'
                      : 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-card text-card-foreground border-card-border hover-elevate active-elevate-2 hover:scale-110 hover:shadow-lg cursor-pointer'
                  }
                  cursor-pointer
                `}
              >
                <span className="relative z-10">
                  {data.keyword}
                </span>
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className={`${gridSize >= 6 ? 'w-6 h-6 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12'} text-white`} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onReset}
            size="lg"
            variant="secondary"
            className="gap-2 text-base sm:text-lg font-bold shadow-md"
            data-testid="button-reset"
          >
            <RotateCcw className="w-5 h-5" />
            처음부터 다시 시작
          </Button>
        </div>
      </div>
    </>
  );
}

// ============================================================
// 서브 컴포넌트: 혼자하기 모드 UI
// ============================================================

interface SoloModeUIProps {
  gridSize: GridSize;
  playerBoard: KeywordData[];
  computerBoard: KeywordData[];
  playerSelected: Set<number>;
  computerSelected: Set<number>;
  playerLines: number;
  computerLines: number;
  currentDrawnWord: KeywordData | null;
  gameResult: GameResult;
  onDrawWord: () => void;
  onReset: () => void;
  getTileSize: (size: GridSize) => string;
}

function SoloModeUI({
  gridSize,
  playerBoard,
  computerBoard,
  playerSelected,
  computerSelected,
  playerLines,
  computerLines,
  currentDrawnWord,
  gameResult,
  onDrawWord,
  onReset,
  getTileSize,
}: SoloModeUIProps) {
  return (
    <>
      {/* 진행도 및 Draw 버튼 */}
      <div className="mb-6">
        <div className="bg-card/90 backdrop-blur-sm p-4 rounded-lg border border-card-border shadow-md">
          <div className="flex flex-col gap-4">
            {/* 진행도 */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">플레이어</p>
                <Badge 
                  variant={playerLines >= REQUIRED_LINES ? "default" : "secondary"}
                  className="text-base font-bold px-3 py-1"
                  data-testid="player-progress"
                >
                  {playerLines} / {REQUIRED_LINES}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">컴퓨터</p>
                <Badge 
                  variant={computerLines >= REQUIRED_LINES ? "default" : "secondary"}
                  className="text-base font-bold px-3 py-1"
                  data-testid="computer-progress"
                >
                  {computerLines} / {REQUIRED_LINES}
                </Badge>
              </div>
            </div>

            {/* Draw 버튼 */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={onDrawWord}
                size="lg"
                disabled={!!gameResult}
                className="w-full gap-2 text-lg font-bold"
                data-testid="button-draw"
              >
                <Shuffle className="w-5 h-5" />
                단어 뽑기
              </Button>
              {currentDrawnWord && (
                <div className="bg-primary/10 border-2 border-primary rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground mb-1">뽑힌 단어</p>
                  <p className="text-xl font-bold text-primary" data-testid="drawn-word">
                    {currentDrawnWord.keyword}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 양쪽 보드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 플레이어 보드 */}
        <div className="bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-xl border border-card-border">
          <h3 className="text-lg font-bold text-center mb-4 text-primary flex items-center justify-center gap-2">
            <Users className="w-5 h-5" />
            플레이어
          </h3>
          <div 
            className="grid gap-1.5 sm:gap-2"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            data-testid="player-grid"
          >
            {playerBoard.map((data, index) => {
              const isSelected = playerSelected.has(index);
              
              return (
                <div
                  key={index}
                  data-testid={`player-tile-${index}`}
                  className={`
                    relative aspect-square rounded-lg p-1 sm:p-2
                    flex items-center justify-center text-center
                    ${getTileSize(gridSize)} font-bold leading-tight
                    border-2 transition-all duration-200
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-card text-card-foreground border-card-border'
                    }
                  `}
                >
                  <span className="relative z-10">
                    {data.keyword}
                  </span>
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className={`${gridSize >= 6 ? 'w-4 h-4' : 'w-5 h-5 sm:w-6 sm:h-6'} text-white`} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 컴퓨터 보드 */}
        <div className="bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-xl border border-card-border">
          <h3 className="text-lg font-bold text-center mb-4 text-accent flex items-center justify-center gap-2">
            <Bot className="w-5 h-5" />
            컴퓨터
          </h3>
          <div 
            className="grid gap-1.5 sm:gap-2"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            data-testid="computer-grid"
          >
            {computerBoard.map((data, index) => {
              const isSelected = computerSelected.has(index);
              
              return (
                <div
                  key={index}
                  data-testid={`computer-tile-${index}`}
                  className={`
                    relative aspect-square rounded-lg p-1 sm:p-2
                    flex items-center justify-center text-center
                    ${getTileSize(gridSize)} font-bold leading-tight
                    border-2 transition-all duration-200
                    ${isSelected 
                      ? 'bg-accent text-accent-foreground border-accent shadow-md'
                      : 'bg-card text-card-foreground border-card-border'
                    }
                  `}
                >
                  <span className="relative z-10">
                    {data.keyword}
                  </span>
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className={`${gridSize >= 6 ? 'w-4 h-4' : 'w-5 h-5 sm:w-6 sm:h-6'} text-white`} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 리셋 버튼 */}
      <div className="flex justify-center">
        <Button
          onClick={onReset}
          size="lg"
          variant="secondary"
          className="gap-2 text-base sm:text-lg font-bold shadow-md"
          data-testid="button-reset"
        >
          <RotateCcw className="w-5 h-5" />
          새 게임
        </Button>
      </div>
    </>
  );
}
