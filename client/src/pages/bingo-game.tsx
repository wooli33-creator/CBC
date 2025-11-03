import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RotateCcw } from 'lucide-react';

interface KeywordData {
  keyword: string;
  description: string;
}

const CLIMATE_KEYWORDS: KeywordData[] = [
  { keyword: '탄소중립', description: '온실가스 배출량을 최대한 줄이고, 남은 배출량은 흡수하여 실질적인 배출량을 0으로 만드는 것을 말해요.' },
  { keyword: '재활용', description: '사용한 물건을 다시 활용하여 쓰레기를 줄이고 자원을 아끼는 방법이에요.' },
  { keyword: '태양에너지', description: '태양의 빛과 열을 이용해 전기를 만드는 깨끗한 에너지예요. 화석연료와 달리 오염물질이 나오지 않아요.' },
  { keyword: '미세먼지', description: '대기 중에 떠다니는 아주 작은 먼지로, 건강에 해롭고 기후 변화에도 영향을 줘요.' },
  { keyword: '해수면 상승', description: '지구 온난화로 빙하가 녹으면서 바다의 높이가 점점 높아지는 현상이에요. 섬나라들이 위험해져요.' },
  { keyword: '식물성 식단', description: '고기 대신 채소, 과일, 곡물 위주로 먹는 식습관으로 온실가스 배출을 크게 줄일 수 있어요.' },
  { keyword: '온실가스', description: '이산화탄소 같은 가스들이 지구를 따뜻하게 만들어 기후 변화를 일으켜요.' },
  { keyword: '전기차', description: '석유 대신 전기로 움직이는 자동차예요. 배기가스가 없어서 공기를 깨끗하게 해요.' },
  { keyword: '분리수거', description: '종이, 플라스틱, 유리 등을 따로 모아서 재활용할 수 있게 하는 거예요.' },
  { keyword: '일회용품', description: '한 번만 쓰고 버리는 물건들이에요. 쓰레기를 많이 만들어서 환경에 안 좋아요.' },
  { keyword: '지구온난화', description: '지구의 평균 기온이 점점 높아지는 현상으로, 많은 환경 문제를 일으켜요.' },
  { keyword: '풍력발전', description: '바람의 힘으로 터빈을 돌려 전기를 만드는 친환경 발전 방식이에요.' },
  { keyword: '북극곰', description: '북극의 얼음이 녹으면서 살 곳을 잃어가는 동물이에요. 기후 변화의 피해자예요.' },
  { keyword: '플라스틱', description: '편리하지만 자연에서 잘 분해되지 않아 환경을 오염시켜요. 바다 생물들에게 특히 위험해요.' },
  { keyword: '에너지절약', description: '필요없는 전기를 끄고, 물을 아껴 쓰는 등 에너지를 아끼는 행동이에요.' },
  { keyword: '생물다양성', description: '다양한 생물들이 함께 사는 것으로, 기후 변화로 많은 생물이 사라지고 있어요.' },
  { keyword: '숲 보호', description: '나무들은 이산화탄소를 흡수해서 공기를 깨끗하게 만들어요. 숲을 지키는 게 중요해요.' },
  { keyword: '대중교통', description: '버스, 지하철 같은 교통수단을 이용하면 자동차보다 환경 오염이 적어요.' },
  { keyword: '물 절약', description: '물은 소중한 자원이에요. 양치할 때 컵을 사용하고, 샤워 시간을 줄여봐요.' },
  { keyword: '텀블러 사용', description: '일회용 컵 대신 자기 컵을 사용하면 쓰레기를 크게 줄일 수 있어요.' },
  { keyword: '친환경 제품', description: '만들 때부터 환경을 생각해서 만든 제품들이에요. 재활용 소재를 사용하기도 해요.' },
  { keyword: '무공해 에너지', description: '태양광, 풍력, 수력 등 환경을 오염시키지 않는 에너지를 말해요.' },
  { keyword: '생태계', description: '생물들과 환경이 서로 영향을 주고받으며 살아가는 시스템이에요. 균형이 중요해요.' },
  { keyword: '기후행동', description: '기후 위기를 막기 위해 우리가 할 수 있는 모든 실천 활동을 말해요. 지금 시작해요!' },
  { keyword: '지속가능성', description: '미래 세대도 좋은 환경에서 살 수 있도록 자원을 아껴 쓰는 것을 말해요.' },
];

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function BingoGame() {
  const [gridData, setGridData] = useState<KeywordData[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<Set<number>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTile, setCurrentTile] = useState<KeywordData | null>(null);
  const [hasBingo, setHasBingo] = useState(false);
  const [winningLines, setWinningLines] = useState<number[][]>([]);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = shuffleArray(CLIMATE_KEYWORDS).slice(0, 25);
    setGridData(shuffled);
    setSelectedTiles(new Set());
    setHasBingo(false);
    setWinningLines([]);
  };

  const checkBingo = (selected: Set<number>): boolean => {
    const lines: number[][] = [];
    
    for (let i = 0; i < 5; i++) {
      const row = Array.from({ length: 5 }, (_, j) => i * 5 + j);
      if (row.every(idx => selected.has(idx))) {
        lines.push(row);
      }
      
      const col = Array.from({ length: 5 }, (_, j) => j * 5 + i);
      if (col.every(idx => selected.has(idx))) {
        lines.push(col);
      }
    }
    
    const diagonal1 = Array.from({ length: 5 }, (_, i) => i * 5 + i);
    if (diagonal1.every(idx => selected.has(idx))) {
      lines.push(diagonal1);
    }
    
    const diagonal2 = Array.from({ length: 5 }, (_, i) => i * 5 + (4 - i));
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
    if (selectedTiles.has(index)) return;
    
    const newSelected = new Set(selectedTiles);
    newSelected.add(index);
    setSelectedTiles(newSelected);
    
    setCurrentTile(data);
    setModalOpen(true);
    
    const bingo = checkBingo(newSelected);
    if (bingo && !hasBingo) {
      setHasBingo(true);
    }
  };

  const handleReset = () => {
    if (confirm('새로운 빙고를 시작하시겠어요?')) {
      initializeGame();
    }
  };

  const isWinningTile = (index: number): boolean => {
    return winningLines.some(line => line.includes(index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-primary/10 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tight flex items-center justify-center gap-3 flex-wrap">
            <span>기후 위기 빙고 챌린지 🌏</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            칸을 클릭해서 기후 지식을 배워보세요!
          </p>
        </header>

        {hasBingo && (
          <div 
            className="bg-gradient-to-r from-primary via-accent to-secondary p-4 sm:p-6 rounded-lg shadow-lg mb-6 animate-in slide-in-from-top duration-500"
            data-testid="victory-banner"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center">
                축하합니다! 당신은 기후 지킴이입니다! 🌍
              </h2>
            </div>
          </div>
        )}

        <div className="bg-card/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-xl border border-card-border">
          <div 
            className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-3 mb-6"
            data-testid="bingo-grid"
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
                  className={`
                    relative aspect-square rounded-xl sm:rounded-2xl p-1.5 sm:p-2 md:p-3
                    flex items-center justify-center text-center
                    text-[0.65rem] sm:text-xs md:text-sm font-bold leading-tight
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
                      <span className="text-2xl sm:text-3xl md:text-4xl">🌱</span>
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
              className="gap-2 text-base sm:text-lg font-semibold shadow-md"
              data-testid="button-reset"
            >
              <RotateCcw className="w-5 h-5" />
              새로운 빙고 시작하기
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
    </div>
  );
}
