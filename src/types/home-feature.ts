export interface HomeFeatureProps {
    title: string;
    description: string;
    imagePosition: 'left' | 'right';
    image: {
        src: string;
        alt: string;
    };
}
