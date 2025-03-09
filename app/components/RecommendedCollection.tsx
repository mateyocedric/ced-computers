'use client';
import {Carousel, Card} from './ui/apple-cards-carousel';

export function RecommendedCollection({collection}: any) {
  const cards = collection.nodes.map((card: any, index: any) => (
    // eslint-disable-next-line react/no-array-index-key
    <Card isModal={false} key={index} card={card} index={index} layout={true} />
  ));

  return <Carousel items={cards} />;
}
