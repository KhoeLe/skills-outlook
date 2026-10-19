"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  JSX,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image, { ImageProps } from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = isMobileView ? 260 : 400;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = isMobileView ? 260 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobileView ? 260 : 384;
      const gap = isMobileView ? 16 : 24;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto py-8 sm:py-12 md:py-20 scroll-smooth [scrollbar-width:none] snap-x snap-mandatory md:snap-none"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className={cn("absolute right-0 z-50 h-auto w-[5%] overflow-hidden bg-linear-to-l")} />
          <div className={cn("flex flex-row justify-start gap-4 sm:gap-5 md:gap-6 pl-4 sm:pl-6 md:pl-8", "max-w-7xl mx-auto")}>
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{ duration: 0.5, delay: 0.15 * index, ease: "easeOut" }}
                key={"card" + index}
                className="last:pr-[5%] md:last:pr-[33%] rounded-3xl snap-center"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        {/* Navigation buttons - larger touch targets on mobile */}
        <div className="flex justify-end gap-2 sm:gap-3 mr-4 sm:mr-6 md:mr-10">
          <button
            className="relative z-40 h-11 w-11 sm:h-10 sm:w-10 rounded-full bg-zinc-100 active:bg-zinc-200 md:hover:bg-zinc-200 flex items-center justify-center disabled:opacity-50 transition-colors touch-manipulation"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <IconArrowNarrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-500" />
          </button>
          <button
            className="relative z-40 h-11 w-11 sm:h-10 sm:w-10 rounded-full bg-zinc-100 active:bg-zinc-200 md:hover:bg-zinc-200 flex items-center justify-center disabled:opacity-50 transition-colors touch-manipulation"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <IconArrowNarrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto safe-area-inset">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-zinc-900/60 backdrop-blur-xl h-full w-full fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="max-w-5xl bg-white h-fit z-60 my-4 sm:my-6 md:my-10 mx-3 sm:mx-4 md:mx-auto p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl font-sans relative shadow-2xl"
            >
              <button
                className="sticky top-4 h-10 w-10 sm:h-8 sm:w-8 right-0 ml-auto bg-zinc-900 rounded-full flex items-center justify-center active:bg-zinc-700 md:hover:bg-zinc-800 transition-colors touch-manipulation"
                onClick={handleClose}
                aria-label="Close modal"
              >
                <IconX className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-sm sm:text-base font-medium text-zinc-900"
              >
                {card.category}
              </motion.p>
              <motion.h2
                layoutId={layout ? `title-${card.title}` : undefined}
                className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 mt-2 sm:mt-4"
              >
                {card.title}
              </motion.h2>
              <div className="py-6 sm:py-8 md:py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={() => setOpen(true)}
        className="rounded-2xl sm:rounded-3xl glass-frosted h-72 w-64 sm:h-80 sm:w-72 md:h-160 md:w-96 overflow-hidden flex flex-col items-start justify-start relative z-10 border border-zinc-200/50 active:border-zinc-300/80 md:hover:border-zinc-300/80 transition-all active:scale-[0.98] md:hover:shadow-lg touch-manipulation"
      >
        <div className="absolute h-full top-0 inset-x-0 bg-linear-to-b from-zinc-900/60 via-transparent to-transparent z-30 pointer-events-none" />
        <div className="relative z-40 p-5 sm:p-6 md:p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-white text-xs sm:text-sm md:text-base font-medium font-sans text-left"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold max-w-xs text-left text-balance font-sans mt-1 sm:mt-2"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          className="object-cover absolute z-10 inset-0"
        />
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};
