export type Question = {
  id: number;
  text: string;
  type: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' | 'EI' | 'SN' | 'TF' | 'JP';
  options: {
    text: string;
    value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  }[];
};

export const questions: Question[] = [
  {
    id: 1,
    text: "주말이 다가옵니다. 당신의 계획은?",
    type: "EI",
    options: [
      { text: "친구들과 핫플에서 신나게 놀기!", value: "E" },
      { text: "집에서 넷플릭스 보며 힐링하기", value: "I" },
    ],
  },
  {
    id: 2,
    text: "처음 가는 모임에 참석했을 때 당신은?",
    type: "EI",
    options: [
      { text: "먼저 다가가서 인사를 건네며 분위기를 주도한다.", value: "E" },
      { text: "누군가 말을 걸어줄 때까지 조용히 상황을 지켜본다.", value: "I" },
    ],
  },
  {
    id: 3,
    text: "여행을 갈 때 당신의 스타일은?",
    type: "JP",
    options: [
      { text: "시간 단위로 철저하게 계획을 세운다.", value: "J" },
      { text: "발길 닿는 대로, 즉흥적인 여행이 최고!", value: "P" },
    ],
  },
  {
    id: 4,
    text: "친구가 '나 우울해서 화분 샀어'라고 말할 때 당신의 반응은?",
    type: "TF",
    options: [
      { text: "무슨 일 있어? 왜 우울해? (걱정)", value: "F" },
      { text: "무슨 화분 샀어? (호기심)", value: "T" },
    ],
  },
  {
    id: 5,
    text: "업무나 과제를 처리할 때 당신은?",
    type: "JP",
    options: [
      { text: "마감일 전에 미리미리 끝내놓아야 마음이 편하다.", value: "J" },
      { text: "마감일이 다가와야 엄청난 집중력이 발휘된다.", value: "P" },
    ],
  },
  {
    id: 6,
    text: "요리를 할 때 당신은?",
    type: "SN",
    options: [
      { text: "레시피에 적힌 정량 그대로 계량해서 넣는다.", value: "S" },
      { text: "눈대중으로 대충 감을 믿고 요리한다.", value: "N" },
    ],
  },
  {
    id: 7,
    text: "고민을 상담하는 친구에게 당신은?",
    type: "TF",
    options: [
      { text: "해결책을 제시하고 현실적인 조언을 해준다.", value: "T" },
      { text: "일단 공감해주고 친구의 편을 들어준다.", value: "F" },
    ],
  },
  {
    id: 8,
    text: "영화를 볼 때 당신은?",
    type: "SN",
    options: [
      { text: "스토리의 전개와 배우의 연기, 시각적 요소에 집중한다.", value: "S" },
      { text: "영화에 담긴 숨은 의미나 상징, 감독의 의도를 파악하려 한다.", value: "N" },
    ],
  },
  {
    id: 9,
    text: "팀 프로젝트에서 갈등이 생겼을 때 당신은?",
    type: "TF",
    options: [
      { text: "누가 잘못했는지 논리적으로 따져서 문제를 해결한다.", value: "T" },
      { text: "서로의 감정이 상하지 않도록 중재하고 타협점을 찾는다.", value: "F" },
    ],
  },
  {
    id: 10,
    text: "새로운 물건을 조립할 때 당신은?",
    type: "SN",
    options: [
      { text: "설명서를 꼼꼼하게 처음부터 끝까지 읽어본다.", value: "S" },
      { text: "일단 부품을 맞춰보며 감으로 조립한다.", value: "N" },
    ],
  }
];

export type Result = {
  type: string;
  title: string;
  description: string;
  color: string;
};

export const results: Record<string, Result> = {
  ISTJ: { type: 'ISTJ', title: '신중한 모범생', description: '책임감이 강하고 꼼꼼하며 현실적인 타입입니다. 규칙을 잘 지킵니다.', color: '#4A90E2' },
  ISFJ: { type: 'ISFJ', title: '다정한 수호자', description: '따뜻하고 헌신적이며 다른 사람의 감정을 잘 배려합니다.', color: '#50E3C2' },
  INFJ: { type: 'INFJ', title: '통찰력 있는 조언자', description: '이상주의적이고 깊은 통찰력을 가졌으며, 타인을 돕는 것을 좋아합니다.', color: '#B8E986' },
  INTJ: { type: 'INTJ', title: '전략적인 사색가', description: '논리적이고 독립적이며, 완벽을 추구하고 계획을 잘 세웁니다.', color: '#F5A623' },
  ISTP: { type: 'ISTP', title: '만능 재주꾼', description: '관찰력이 뛰어나고 상황 적응력이 좋으며, 효율을 중시합니다.', color: '#D0021B' },
  ISFP: { type: 'ISFP', title: '자유로운 예술가', description: '온화하고 친절하며, 현재의 순간을 즐기고 예술적인 감각이 뛰어납니다.', color: '#F8E71C' },
  INFP: { type: 'INFP', title: '열정적인 중재자', description: '상상력이 풍부하고 자신의 가치관을 중요하게 생각합니다.', color: '#8B572A' },
  INTP: { type: 'INTP', title: '논리적인 사색가', description: '지적 호기심이 많고 분석적이며, 새로운 아이디어를 좋아합니다.', color: '#417505' },
  ESTP: { type: 'ESTP', title: '에너지 넘치는 활동가', description: '스릴을 즐기고 문제 해결 능력이 뛰어나며 현실적입니다.', color: '#BD10E0' },
  ESFP: { type: 'ESFP', title: '자유로운 영혼', description: '사교적이고 낙천적이며, 주변 사람들을 즐겁게 해주는 능력이 있습니다.', color: '#9013FE' },
  ENFP: { type: 'ENFP', title: '재기발랄한 활동가', description: '열정적이고 창의적이며, 새로운 가능성을 찾는 것을 즐깁니다.', color: '#4A4A4A' },
  ENTP: { type: 'ENTP', title: '뜨거운 논쟁을 즐기는 변론가', description: '두뇌 회전이 빠르고 논쟁을 즐기며, 새로운 도전을 좋아합니다.', color: '#000000' },
  ESTJ: { type: 'ESTJ', title: '엄격한 관리자', description: '체계적이고 현실적이며, 조직을 이끄는 리더십이 뛰어납니다.', color: '#007AFF' },
  ESFJ: { type: 'ESFJ', title: '사교적인 외교관', description: '동정심이 많고 다른 사람을 잘 돕고 배려하며, 인간관계를 중시합니다.', color: '#34C759' },
  ENFJ: { type: 'ENFJ', title: '정의로운 사회운동가', description: '카리스마 있고 타인에게 동기를 부여하는 능력이 뛰어납니다.', color: '#FF9500' },
  ENTJ: { type: 'ENTJ', title: '대담한 통솔자', description: '단호하고 리더십이 있으며, 목표 달성을 위해 체계적으로 움직입니다.', color: '#FF3B30' },
};
