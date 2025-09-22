/* ── News Grid ──────────────────────────────────────────────────────────────── */

import { ArrowRight } from "lucide-react";
import React from "react";
import Button from "./Button";
import Card from "./Card";
import Container from "./Container";
import SectionTitle from "./SectionTitle";

const items = [
  {
    title: "New: Markets you can trade, end-to-end",
    img: "https://images.unsplash.com/photo-1518186233392-c232efbf2373?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Capitalice Affiliate Guide & Program",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Instant withdrawals: fast and convenient processing",
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
  },
];

const NewsGrid: React.FC = () => (
  <section id="news" className="bg-neutral-950 py-16">
    <Container>
      <SectionTitle
        title="Keep up with Capitalice"
        subtitle="Stay tuned for product improvements, promotions, events, and updates."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((n) => (
          <Card key={n.title} className="p-0">
            <img
              src={n.img}
              alt="news"
              className="h-44 w-full rounded-2xl object-cover"
            />
            <div className="p-5">
              <h4 className="font-semibold text-white">{n.title}</h4>
              <div className="mt-4">
                <Button
                  className="bg-neutral-900 text-neutral-200 ring-1 ring-inset ring-neutral-800"
                  icon={ArrowRight}
                >
                  Read more
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

export default NewsGrid;
