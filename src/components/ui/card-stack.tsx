"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence, type PanInfo } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CardStackProps {
	items: React.ReactNode[]
}

export default function CardStack({ items }: CardStackProps) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [direction, setDirection] = useState(0)

	const handleDragEnd = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo,
	) => {
		const swipeThreshold = 50
		if (info.offset.x > swipeThreshold) {
			// Swiped right - go to previous card
			handlePrevious()
		} else if (info.offset.x < -swipeThreshold) {
			// Swiped left - go to next card
			handleNext()
		}
	}

	const handleNext = () => {
		setDirection(1)
		setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
	}

	const handlePrevious = () => {
		setDirection(-1)
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + items.length) % items.length,
		)
	}

	const variants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 300 : -300,
			opacity: 0,
			scale: 0.8,
			zIndex: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
			scale: 1,
			zIndex: 1,
			transition: {
				duration: 0.3,
			},
		},
		exit: (direction: number) => ({
			x: direction < 0 ? 300 : -300,
			opacity: 0,
			scale: 0.8,
			zIndex: 0,
			transition: {
				duration: 0.3,
			},
		}),
	}

	return (
		<div className="relative w-full max-w-md mx-auto h-[400px]">
			<div className="absolute inset-0 flex items-center justify-center">
				<AnimatePresence initial={false} custom={direction} mode="popLayout">
					<motion.div
						key={currentIndex}
						custom={direction}
						variants={variants}
						initial="enter"
						animate="center"
						exit="exit"
						drag="x"
						dragConstraints={{ left: 0, right: 0 }}
						onDragEnd={handleDragEnd}
						className="absolute w-full h-full cursor-grab active:cursor-grabbing"
					>
						{items[currentIndex]}
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Navigation buttons */}
			<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
				<Button
					variant="outline"
					size="icon"
					onClick={handlePrevious}
					className="bg-white/80 backdrop-blur-sm hover:bg-white"
				>
					<ChevronLeft className="h-4 w-4" />
					<span className="sr-only">Previous</span>
				</Button>
				<div className="flex items-center gap-1">
					{items.map((_, index) => (
						<div
							key={index}
							className={`w-2 h-2 rounded-full ${
								index === currentIndex ? "bg-primary" : "bg-gray-300"
							}`}
							onClick={() => {
								setDirection(index > currentIndex ? 1 : -1)
								setCurrentIndex(index)
							}}
						/>
					))}
				</div>
				<Button
					variant="outline"
					size="icon"
					onClick={handleNext}
					className="bg-white/80 backdrop-blur-sm hover:bg-white"
				>
					<ChevronRight className="h-4 w-4" />
					<span className="sr-only">Next</span>
				</Button>
			</div>
		</div>
	)
}
