import { motion } from 'framer-motion';
import { ShoppingBag, Gift, Star } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import styles from './StorePage.module.css';
import { useStore } from '../store/useStore';

const PRODUCTS = [
  { id: '1', name: '디카페인 허브티 세트', type: '오전 멍함형', desc: '카페인 없이 아침을 깨우는 산뜻한 블렌딩', price: 24000 },
  { id: '2', name: '프리미엄 수면 유도 캔들', type: '밤 각성형', desc: '라벤더와 캐모마일이 섞인 깊은 휴식', price: 32000 },
  { id: '3', name: '유기농 효소 스틱 (30일분)', type: '식후 졸림형', desc: '더부룩함 없는 식사를 위한 천연 소화제', price: 45000 },
  { id: '4', name: '릴렉싱 넥앤숄더 마사지 젤', type: '긴장 과부하형', desc: '근육 긴장을 풀어주는 쿨링 릴렉스 젤', price: 18000 },
  { id: '5', name: '오후 활력 비타민B 콤플렉스', type: '오후 방전형', desc: '방전된 에너지를 즉각적으로 채워주는 활력소', price: 28000 },
];

export default function StorePage() {
  const { userType, showToast } = useStore();
  
  // Recommend product based on type, fallback to first item
  const recommendedProduct = PRODUCTS.find(p => p.type === userType) || PRODUCTS[0];
  const otherProducts = PRODUCTS.filter(p => p.id !== recommendedProduct.id);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>컨디션 스토어</h1>
      </header>

      {/* Subscription Banner */}
      <div className={styles.premiumBanner}>
        <div className={styles.bannerContent}>
          <h3>1개월 맞춤 멘토링 <Star size={16} fill="var(--warning)" color="var(--warning)" /></h3>
          <p>전문 코치와 함께하는 1:1 루틴 관리</p>
          <span className={styles.priceTag}>월 29,000원</span>
        </div>
        <button className={styles.subscribeButton} onClick={() => showToast('결제 모듈을 연동 중입니다.')}>구독하기</button>
      </div>

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.highlight}>{userType || '당신'}</span>을 위한 추천
        </h2>
        
        <motion.div 
          className={styles.recommendCard}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className={styles.productImagePlaceholder}>
            <ShoppingBag size={48} color="var(--accent-primary)" opacity={0.5} />
          </div>
          <div className={styles.productInfo}>
            <span className={styles.productType}>{recommendedProduct.type} 맞춤</span>
            <h3 className={styles.productName}>{recommendedProduct.name}</h3>
            <p className={styles.productDesc}>{recommendedProduct.desc}</p>
            <div className={styles.productPrice}>{recommendedProduct.price.toLocaleString()}원</div>
          </div>
          <div className={styles.productActions}>
            <button className={styles.buyButton} onClick={() => showToast('장바구니에 담겼습니다!')}>구매하기</button>
            <button className={styles.giftButton} onClick={() => showToast('선물하기 기능은 준비 중입니다.')}><Gift size={18} /> 선물하기</button>
          </div>
        </motion.div>

        <h2 className={styles.sectionTitle} style={{ marginTop: '32px' }}>인기 제품</h2>
        
        <div className={styles.productList}>
          {otherProducts.map(product => (
            <div key={product.id} className={styles.productItem}>
              <div className={styles.itemImagePlaceholder}></div>
              <div className={styles.itemInfo}>
                <h4>{product.name}</h4>
                <div className={styles.itemPrice}>{product.price.toLocaleString()}원</div>
              </div>
              <button className={styles.giftIconBtn} onClick={() => showToast('선물하기 기능은 준비 중입니다.')}><Gift size={20} /></button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
