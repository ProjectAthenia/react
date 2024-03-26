import { configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

configure({adapter: new Adapter()});

jest.mock('swiper/react', () => ({
    Swiper: ({ children }: any) => <div data-testid="Swiper-testId">{children}</div>,
    SwiperSlide: ({ children }: any) => (
        <div data-testid="SwiperSlide-testId">{children}</div>
    ),
}))
