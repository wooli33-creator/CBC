import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { RotateCcw } from 'lucide-react';

interface KeywordData {
  keyword: string;
  description: string;
}

type GridSize = 3 | 4 | 5 | 6 | 7;

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

function seededShuffle<T>(array: T[], seed: string): T[] {
  const newArray = [...array];
  const random = seededRandom(seed);
  
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getSessionSeed(): string {
  let seed = sessionStorage.getItem('bingo-seed');
  if (!seed) {
    seed = `${crypto.randomUUID()}-${Date.now()}`;
    sessionStorage.setItem('bingo-seed', seed);
  }
  return seed;
}

function generateNewSeed(): string {
  const seed = `${crypto.randomUUID()}-${Date.now()}`;
  sessionStorage.setItem('bingo-seed', seed);
  return seed;
}

export default function BingoGame() {
  const [level, setLevel] = useState<number>(1);
  const [gridData, setGridData] = useState<KeywordData[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<Set<number>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTile, setCurrentTile] = useState<KeywordData | null>(null);
  const [hasBingo, setHasBingo] = useState(false);
  const [winningLines, setWinningLines] = useState<number[][]>([]);
  const [currentSeed, setCurrentSeed] = useState<string>('');
  const [levelCompleteModalOpen, setLevelCompleteModalOpen] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  
  const gridSize: GridSize = (level + 2) as GridSize;

  useEffect(() => {
    const seed = getSessionSeed();
    setCurrentSeed(seed);
    initializeGame(gridSize, seed);
  }, []);

  useEffect(() => {
    if (currentSeed) {
      initializeGame(gridSize, currentSeed);
    }
  }, [gridSize]);

  const initializeGame = (size: GridSize, seed: string) => {
    const totalCells = size * size;
    const sourceArray = size === 3 ? PRACTICE_KEYWORDS : CLIMATE_KEYWORDS;
    
    if (sourceArray.length < totalCells) {
      console.warn(`Not enough keywords for ${size}x${size} grid. Need ${totalCells}, have ${sourceArray.length}`);
    }
    
    const shuffled = seededShuffle(sourceArray, `${seed}-${size}`).slice(0, totalCells);
    setGridData(shuffled);
    setSelectedTiles(new Set());
    setHasBingo(false);
    setWinningLines([]);
  };

  const checkBingo = (selected: Set<number>, size: GridSize): boolean => {
    const lines: number[][] = [];
    
    for (let i = 0; i < size; i++) {
      const row = Array.from({ length: size }, (_, j) => i * size + j);
      if (row.every(idx => selected.has(idx))) {
        lines.push(row);
      }
      
      const col = Array.from({ length: size }, (_, j) => j * size + i);
      if (col.every(idx => selected.has(idx))) {
        lines.push(col);
      }
    }
    
    const diagonal1 = Array.from({ length: size }, (_, i) => i * size + i);
    if (diagonal1.every(idx => selected.has(idx))) {
      lines.push(diagonal1);
    }
    
    const diagonal2 = Array.from({ length: size }, (_, i) => i * size + (size - 1 - i));
    if (diagonal2.every(idx => selected.has(idx))) {
      lines.push(diagonal2);
    }

    if (lines.length > 0) {
      setWinningLines(lines);
      return true;
    }
    
    return false;
  };

  const handleTileClick = (index: number, data: KeywordData) => {
    if (selectedTiles.has(index) || allLevelsComplete) return;
    
    const newSelected = new Set(selectedTiles);
    newSelected.add(index);
    setSelectedTiles(newSelected);
    
    setCurrentTile(data);
    setModalOpen(true);
    
    const bingo = checkBingo(newSelected, gridSize);
    if (bingo && !hasBingo) {
      setHasBingo(true);
      setTimeout(() => {
        setModalOpen(false);
        setLevelCompleteModalOpen(true);
      }, 800);
    }
  };

  const handleNextLevel = () => {
    setLevelCompleteModalOpen(false);
    
    if (level >= 5) {
      setAllLevelsComplete(true);
      return;
    }
    
    setLevel(level + 1);
    setHasBingo(false);
  };

  const handleReset = () => {
    if (confirm('처음부터 다시 시작하시겠습니까?')) {
      const newSeed = generateNewSeed();
      setCurrentSeed(newSeed);
      setLevel(1);
      setHasBingo(false);
      setAllLevelsComplete(false);
      setLevelCompleteModalOpen(false);
      initializeGame(3, newSeed);
    }
  };

  const isWinningTile = (index: number): boolean => {
    return winningLines.some(line => line.includes(index));
  };

  const getLevelName = (lv: number): string => {
    const names = ['연습 단계', '초급 지킴이', '중급 지킴이', '상급 지킴이', '마스터 지킴이'];
    return names[lv - 1] || '';
  };

  const getLevelCompleteMessage = (lv: number): { title: string; message: string } => {
    const messages = [
      { title: '연습 완료! 🌱', message: '기본기를 익혔습니다. 이제 본격적인 도전을 시작해볼까요?' },
      { title: '초급 달성! 🌿', message: '훌륭합니다! 기후 지식이 자라나고 있어요.' },
      { title: '중급 달성! 🌳', message: '대단해요! 이제 진정한 기후 지킴이의 모습이 보입니다.' },
      { title: '상급 달성! 🌲', message: '놀라워요! 거의 전문가 수준이에요. 마지막 도전만 남았습니다!' },
      { title: '지구 지킴이 등단! 🏆🌍', message: '축하합니다! 모든 단계를 완료하셨습니다. 당신은 이제 진정한 지구 지킴이입니다!' }
    ];
    return messages[lv - 1] || messages[0];
  };
  
  const getTileSize = () => {
    switch(gridSize) {
      case 3: return 'text-xs sm:text-sm md:text-base';
      case 4: return 'text-[0.7rem] sm:text-xs md:text-sm';
      case 5: return 'text-[0.65rem] sm:text-xs md:text-sm';
      case 6: return 'text-[0.6rem] sm:text-[0.7rem] md:text-xs';
      case 7: return 'text-[0.55rem] sm:text-[0.65rem] md:text-xs';
      default: return 'text-xs sm:text-sm md:text-base';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-primary/10 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tight flex items-center justify-center gap-3 flex-wrap">
            <span>기후 위기 빙고 챌린지 🌏</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            3×3부터 7×7까지 모든 빙고를 완성하여 지구 지킴이 등단에 도전하세요!
          </p>
        </header>

        {allLevelsComplete ? (
          <div 
            className="bg-gradient-to-r from-primary via-accent to-secondary p-6 sm:p-8 rounded-xl shadow-2xl mb-6 animate-in zoom-in duration-700"
            data-testid="all-complete-banner"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">
                🏆 지구 지킴이 등단 🌍
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
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="default" className="text-base font-bold px-3 py-1">
                      {getLevelName(level)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {gridSize}×{gridSize} 그리드
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {level === 1 ? '연습 단계로 시작합니다' : `레벨 ${level}/5 진행 중`}
                  </p>
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
            className="bg-gradient-to-r from-primary via-accent to-secondary p-4 sm:p-6 rounded-lg shadow-lg mb-6 animate-in slide-in-from-top duration-500"
            data-testid="victory-banner"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center">
                빙고 완성! 🌍
              </h2>
            </div>
          </div>
        )}

        <div className="bg-card/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-xl border border-card-border">
          <div 
            className={`grid gap-1.5 sm:gap-2 md:gap-3 mb-6`}
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            data-testid="bingo-grid"
            role="grid"
            aria-label={`${gridSize}x${gridSize} 빙고 게임판`}
          >
            {gridData.map((data, index) => {
              const isSelected = selectedTiles.has(index);
              const isWinning = isWinningTile(index);
              
              return (
                <button
                  key={index}
                  onClick={() => handleTileClick(index, data)}
                  disabled={isSelected}
                  data-testid={`tile-${index}`}
                  role="gridcell"
                  aria-label={`${data.keyword} ${isSelected ? '선택됨' : '선택 안됨'}`}
                  className={`
                    relative aspect-square rounded-xl sm:rounded-2xl p-1.5 sm:p-2 md:p-3
                    flex items-center justify-center text-center
                    ${getTileSize()} font-bold leading-tight
                    transition-all duration-200 border-2
                    ${isSelected 
                      ? isWinning
                        ? 'bg-gradient-to-br from-primary via-accent to-secondary text-white border-primary shadow-lg scale-105'
                        : 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-card text-card-foreground border-card-border hover-elevate active-elevate-2 hover:scale-110 hover:shadow-lg cursor-pointer'
                    }
                    ${isSelected ? 'cursor-default' : ''}
                  `}
                >
                  <span className="relative z-10 break-keep hyphens-auto">
                    {data.keyword}
                  </span>
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`${gridSize >= 6 ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl md:text-4xl'}`}>🌱</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleReset}
              size="lg"
              variant="secondary"
              className="gap-2 text-base sm:text-lg font-bold shadow-md"
              data-testid="button-reset"
              aria-label="처음부터 다시 시작"
            >
              <RotateCcw className="w-5 h-5" />
              처음부터 다시 시작
            </Button>
          </div>
        </div>

        <footer className="text-center mt-6 sm:mt-8">
          <p className="text-base sm:text-lg md:text-xl font-medium text-primary flex items-center justify-center gap-2 flex-wrap">
            <span>지구를 지키는 작은 실천을 시작해요 🌱</span>
          </p>
        </footer>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent 
          className="sm:max-w-md bg-popover border-2 border-popover-border"
          data-testid="modal-keyword-info"
        >
          {currentTile && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <span className="text-2xl">🌱</span>
                  {currentTile.keyword}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-base leading-relaxed text-popover-foreground pt-2">
                {currentTile.description}
              </DialogDescription>
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setModalOpen(false)}
                  variant="default"
                  size="lg"
                  className="font-bold"
                  data-testid="button-close-modal"
                >
                  알겠어요!
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={levelCompleteModalOpen} onOpenChange={setLevelCompleteModalOpen}>
        <DialogContent 
          className="sm:max-w-lg bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-2 border-primary/30"
          data-testid="modal-level-complete"
        >
          {(() => {
            const msg = getLevelCompleteMessage(level);
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-primary text-center">
                    {msg.title}
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-lg leading-relaxed text-foreground pt-4 text-center">
                  {msg.message}
                </DialogDescription>
                <div className="flex justify-center pt-6 gap-3">
                  {level < 5 ? (
                    <Button
                      onClick={handleNextLevel}
                      variant="default"
                      size="lg"
                      className="font-bold text-lg px-8"
                      data-testid="button-next-level"
                    >
                      다음 단계로 🚀
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextLevel}
                      variant="default"
                      size="lg"
                      className="font-bold text-lg px-8"
                      data-testid="button-complete-all"
                    >
                      완료! 🏆
                    </Button>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
