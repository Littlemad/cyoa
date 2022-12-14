import React, {useState, useEffect, useCallback} from "react";
import {NavLink, Link} from "react-router-dom";
import "./Navigation.scss";
import dataJSON from "data/data.json";

function Navigation(props) {
	const myPlace = dataJSON.locations[props.room - 1];
	const hasChoice = (myPlace.choices && myPlace.choices.length) || 0;
	let myChoicesLength = 0;
	let myLocationLength = 0;

	if (myPlace.choices) {
		myChoicesLength = myPlace.choices.length;
	}

	if (myPlace.locationConnection) {
		myLocationLength = myPlace.locationConnection.length;
	}

	const myItem = dataJSON.items;

	const initialArray = [1];
	const initialCoin = 50;

	const [equipmentState, setEquipmentState] = useState(initialArray);
	const [coinState, setCoinState] = useState(initialCoin);
	const [isChoiceVisible, setIsChoiceVisible] = useState(true);

	const manageEquipment = (itemID, action) => {
		/*
		const myItemID = itemID - 1;

		if (myItem[myItemID].buy) {
			setCoinState(coinState - myItem[myItemID].buy);
			setIsChoiceVisible(false);
		}

		if (myItem[myItemID].sell) {
			setCoinState(coinState + myItem[myItemID].sell);
			setIsChoiceVisible(false);
		}

		if (myItem[myItemID].own) {
			// Add
			setEquipmentState([...equipmentState, itemID]);
			setIsChoiceVisible(false);
		} else {
			// Remove
			setEquipmentState((current) =>
				current.filter((item) => {
					return item !== myItemID;
				})
			);
			setIsChoiceVisible(false);
		}
*/
	};

	const handleClick = (e, action) => {
		// check if other choices were being selected
		if (isChoiceVisible) {
			setIsChoiceVisible(true);
			e.preventDefault();
			manageEquipment(myItem[action].id);
		}
	};

	/* KEYPRESS events */
	const handleKeyPress = useCallback(
		(event) => {
			// console.log(`Key pressed: ${event.key}`);

			const myLength = myChoicesLength + myLocationLength + 1;

			let i = 1;
			do {
				if (event.key === i.toString()) {
					document.getElementsByClassName("main-nav__link-" + i)[0].click();
				}
				i++;
			} while (i <= myLength);
		},
		[myChoicesLength, myLocationLength]
	);

	// stop going back with browser
	/*
		window.history.pushState(null, null, window.location.href);
		window.onpopstate = function () {
			window.history.go(1);
		};
		*/

	useEffect(() => {
		// attach the event listener
		document.addEventListener("keydown", handleKeyPress);

		// remove the event listener
		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [handleKeyPress]);

	const checkEquipment = () => {
		let myEquip = "The backpack is empty from the start";

		if (equipmentState.length === 0) {
			myEquip = "An empty backpack";
		} else {
			myEquip = equipmentState.map((value) => myItem[value - 1].name).join(", ");
		}

		return myEquip;
	};

	const checkDuplicate = equipmentState.some((val, i) => equipmentState.indexOf(val) !== i);

	useEffect(() => {
		const addOrRemoveEquipment = (itemID, action) => {
			if (itemID && action) {
				if (action === "add") {
					setEquipmentState((equipmentState) => {
						return [...equipmentState, itemID];
					});
				} else if (action === "remove") {
					setEquipmentState((current) =>
						current.filter((item) => {
							return item !== itemID[0];
						})
					);
				}
			}
		};

		const addOrRemoveItem = (val) => {
			if (val instanceof Array) {
				if (val[0]) {
					addOrRemoveEquipment(val[0], "remove");
				}
				if (val[1]) {
					if (!checkDuplicate) {
						addOrRemoveEquipment(val[1], "add");
					}
				}
			}
		};

		addOrRemoveItem([myPlace.remove, myPlace.add]);
	}, [myPlace.remove, myPlace.add, setEquipmentState, checkDuplicate]);

	return (
		<>
			<h3 className="title h1">{myPlace.name}</h3>
			<div className="main-ui grid grid--gap-l spacing">
				<div className="main-content grid__col col1">
					{myPlace.image2 && <img className="main-content__img pos-absolute main-content__img-2" src={myPlace.image2} alt={myPlace.imageAlt2} />}
					{myPlace.image3 && <img className="main-content__img pos-absolute main-content__img-3" src={myPlace.image3} alt={myPlace.imageAlt3} />}
					{myPlace.image1 && <img className="main-content__img" src={myPlace.image1} alt={myPlace.imageAlt1} />}
					<p>{myPlace.longDesc1}</p>
					{myPlace.longDesc2 && <p>{myPlace.longDesc2}</p>}
					{myPlace.longDesc3 && <p>{myPlace.longDesc3}</p>}
					{myPlace.longDesc4 && <p>{myPlace.longDesc4}</p>}
					{myPlace.longDesc5 && <p>{myPlace.longDesc5}</p>}
					<nav className="main-nav grid--pad-m">
						<ul className="main-nav__ul">
							{myPlace.choices &&
								myPlace.choices.map((choice) => (
									<li key={choice.id} className={`main-nav__li ${isChoiceVisible ? "" : "hideLink"}`}>
										<Link to="#" className={`main-nav__link main-nav__link-${choice.id}`} onClick={(e) => handleClick(e, choice.item - 1)} disabled={!isChoiceVisible}>
											{choice.id} - {choice.enterDesc} {choice.name} {choice.enterDescAfter}
										</Link>
									</li>
								))}

							{myPlace.locationConnection &&
								myPlace.locationConnection.map((place) => {
									const myNearbyPlace = dataJSON.locations[place - 1];
									const myPos = myPlace.locationConnection.indexOf(place) + 1;
									const myLinkNumID = myPos + myChoicesLength;

									return (
										<li key={`key${place}`} className="main-nav__li">
											<NavLink to={`/cyoa/page${place}`} className={`main-nav__link-${myLinkNumID}`}>
												{hasChoice + myPos} - {myNearbyPlace.enterDesc} <span className="highlight">{myNearbyPlace.name}</span> {myNearbyPlace.enterDescAfter}
											</NavLink>
										</li>
									);
								})}
						</ul>
					</nav>
				</div>
				<div className="side-content grid__col col2">
					<div className="character grid--pad-m spacing">
						<div className="character__avatar"></div>
						<h3 className="title h3">Character</h3>
						<strong>Mood:</strong> &nbsp;Vigilant
						<br />
						<strong>Class:</strong> &nbsp;Undefined
					</div>
					<div className="inventory grid--pad-m">
						<h3 className="title h3">Inventory</h3>
						<ul className="list">
							<li>{coinState > 0 ? `A pouch with ${coinState} gold pieces` : `An empty pouch`}</li>
							<li>{checkEquipment()}</li>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}

export default Navigation;
