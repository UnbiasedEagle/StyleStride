import { CategorySelection } from '@/components/storefront/category-selection';
import { FeaturedProducts } from '@/components/storefront/featured-products';
import { StoreFrontHero } from '@/components/storefront/hero';

const Homepage = () => {
  return (
    <div>
      <StoreFrontHero />
      <CategorySelection />
      <FeaturedProducts />
    </div>
  );
};

export default Homepage;
