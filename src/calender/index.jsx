import { useRef, useState } from "react";
import { ArrowCircleLeft, ArrowCircleRight, Trash, X } from "@phosphor-icons/react";
import {
	SevenColGrid,
	Wrapper,
	HeadDays,
	DateControls,
	StyledEvent,
	SeeMore,
	PortalWrapper,
} from "./styled";
import { DAYS, MOCKAPPS, MONTHS } from "./conts";
import {
	datesAreOnSameDay,
	getDarkColor,
	getDaysInMonth,
	getSortedDays,
	nextMonth,
	prevMonth,
} from "./utils";

export const Calender = () => {
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
	const [currentDate, setCurrentDate] = useState(new Date());
	const [events, setEvents] = useState(MOCKAPPS);
	const dragDateRef = useRef();
	const dragindexRef = useRef();
	const [showPortal, setShowPortal] = useState(false);
	const [portalData, setPortalData] = useState({});

	const addEvent = (date, event) => {
		if (!event.target.classList.contains("StyledEvent")) {
			const text = window.prompt("name");
			if (text) {
				date.setHours(0);
				date.setSeconds(0);
				date.setMilliseconds(0);
				setEvents((prev) => [
					...prev,
					{ date, title: text, color: getDarkColor() },
				]);
			}
		}
	};

	const drag = (index, e) => {
		dragindexRef.current = { index, target: e.target };
	};

	const onDragEnter = (date, e) => {
		e.preventDefault();
		dragDateRef.current = { date, target: e.target.id };
	};

	const drop = (ev) => {
		ev.preventDefault();

		setEvents((prev) =>
			prev.map((ev, index) => {
				if (index === dragindexRef.current.index) {
					ev.date = dragDateRef.current.date;
				}
				return ev;
			})
		);
	};

	const handleOnClickEvent = (event) => {
		setShowPortal(true);
		setPortalData(event);
	};

	const handlePotalClose = () => setShowPortal(false);

	const handleDelete = () => {
		setEvents((prevEvents) =>
			prevEvents.filter((ev) => ev.title !== portalData.title)
		);
		handlePotalClose();
	};

	return (
		<Wrapper>
			<DateControls>
				<ArrowCircleLeft
					size={32}
					onClick={() => prevMonth(currentDate, setCurrentDate)}
				/>
				{MONTHS[currentMonth]} {currentYear}
				<ArrowCircleRight
					size={32}
					onClick={() => nextMonth(currentDate, setCurrentDate)}
				/>
			</DateControls>
			<SevenColGrid>
				{DAYS.map((day, index) => (
					<HeadDays className="nonDRAG" key={index}>
						{day}
					</HeadDays>
				))}
			</SevenColGrid>

			<SevenColGrid
				fullheight={true}
				is28Days={getDaysInMonth(currentDate) === 28}
			>
				{getSortedDays(currentDate).map((day, index) => (
					<div
						key={index}
						id={`${currentDate.getFullYear()}/${currentDate.getMonth()}/${day}`}
						onDragEnter={(e) =>
							onDragEnter(
								new Date(
									currentDate.getFullYear(),
									currentDate.getMonth(),
									day
								),
								e
							)
						}
						onDragOver={(e) => e.preventDefault()}
						onDragEnd={drop}
						onClick={(e) =>
							addEvent(
								new Date(
									currentDate.getFullYear(),
									currentDate.getMonth(),
									day
								),
								e
							)
						}
					>
						<span
							className={`nonDRAG ${
								datesAreOnSameDay(
									new Date(),
									new Date(
										currentDate.getFullYear(),
										currentDate.getMonth(),
										day
									)
								)
									? "active"
									: ""
							}`}
						>
							{day}
						</span>
						<EventWrapper>
							{events.map(
								(ev, index) =>
									datesAreOnSameDay(
										ev.date,
										new Date(
											currentDate.getFullYear(),
											currentDate.getMonth(),
											day
										)
									) && (
										<StyledEvent
											onDragStart={(e) => drag(index, e)}
											onClick={() => handleOnClickEvent(ev)}
											draggable
											className="StyledEvent"
											id={`${ev.color} ${ev.title}`}
											key={ev.title}
											bgColor={ev.color}
										>
											{ev.title}
										</StyledEvent>
									)
							)}
						</EventWrapper>
					</div>
				))}
			</SevenColGrid>
			{showPortal && (
				<Portal
					{...portalData}
					handleDelete={handleDelete}
					handlePotalClose={handlePotalClose}
				/>
			)}
		</Wrapper>
	);
};

const EventWrapper = ({ children }) => {
	if (children.filter((child) => child).length)
		return (
			<>
				{children}
				{children.filter((child) => child).length > 2 && (
					<SeeMore
						onClick={(e) => {
							e.stopPropagation();
							console.log("clicked p");
						}}
					>
						Ver mais...
					</SeeMore>
				)}
			</>
		);
};

const Portal = ({ title, date, handleDelete, handlePotalClose }) => {
	return (
		<PortalWrapper>
			<h2>{title}</h2>
			<p>{date.toDateString()}</p>
			<Trash onClick={handleDelete} size={32}/>
			<X onClick={handlePotalClose} size={32}/>
		</PortalWrapper>
	);
};
