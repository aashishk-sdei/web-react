import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "./SideBar"
import MainContent from "./MainContent"
import { v4 as uuidv4 } from "uuid";
import "./index.css";
import Modal from "../../Common/Modal";
import { modalType } from "../../../utils";
import { addIndividual } from "../../../redux/actions/family";
import { treePeopleList } from './../../../redux/actions/sidebar';
import { getRecentTree, getOwner } from "./../../../services";
import { getTreesListAsync } from "./../../../redux/actions/homepage";


const {
	ADD_NONFAMILY
} = modalType;
const getButtonNameValue = (nameId, addRelatioShipSelected) => {
	if (addRelatioShipSelected) {
		return '';
	}
	switch (nameId) {
		case 2: return "friend";
		case 3: return "classmate";
		case 4: return "neighbor";
		case 5: return "military comrade";
		case 6: return "colleague";
		case 7: return "fellow congregant";
		case 8: return "other";
		default: return "";
	}
}
const sidebarValue = [
	{ id: 1, sidenavname: "All Relationships", callingname: "", noContent: "other relationships", addbutton: "Add Relationship" },
	{ id: 2, sidenavname: "Friends", callingname: "Friend", noContent: "friends", addbutton: "Add Friend" },
	{ id: 3, sidenavname: "Classmates", callingname: "Classmate", noContent: "classmates", addbutton: "Add Classmate" },
	{ id: 4, sidenavname: "Neighbors", callingname: "Neighbor", noContent: "neighbors", addbutton: "Add Neighbor" },
	{ id: 5, sidenavname: "Military Comrades", callingname: "Military Comrade", noContent: "military comrades", addbutton: "Add Military Comrade" },
	{ id: 6, sidenavname: "Colleagues", callingname: "Colleague", noContent: "colleague", addbutton: "Add Colleague" },
	{ id: 7, sidenavname: "Fellow Congregants", callingname: "Fellow Congregant", noContent: "fellow congregants", addbutton: "Add Fellow Congregant" },
	{ id: 8, sidenavname: "Others", callingname: "Other", noContent: "other relationships", addbutton: "Add Relationship" },
]
const getName = (person) => {
	let name = []
	if (person?.givenName?.givenName) {
		name.push(person.givenName.givenName)
	}
	if (person?.surname?.surname) {
		name.push(person.surname.surname)
	}
	return name.join(' ')
}
const getfilterdata = (relataionShip, connectionType) => {
	let data;
	if (connectionType === "") {
		data = relataionShip
	} else {
		data = relataionShip && relataionShip?.length > 0 && relataionShip.filter(x => x.connectionType === connectionType)
	}
	if (!data) {
		data = []
	}
	return data;
}
const Relationships = () => {
	const dispatch = useDispatch();
	const [activeClass, setActiveClass] = useState('')
	const [moduleName, setmoduleName] = useState('All Relationships')
	const [moduleObj, setModuleObj] = useState(sidebarValue[0])
	const [selectButton, setselectButton] = useState(1)
	const [modalAction, setModalAction] = useState(ADD_NONFAMILY);
	const [openModal, setOpenModal] = useState(false);
	const [hasPerson, setHasPerson] = useState(false)
	const [modalPerson, setModalPerson] = useState(null);
	const [listData, setListData] = useState([])
	const [disabledlistData, setdisabledListData] = useState([])
	const [treeProfileId, setTreeId] = useState(null);
	const [addRelatioShipSelected, setAddRelationShipSelected] = useState(false)
	const relataionShip = useSelector(state => state.relationship.relationship);
	const { personalInfo } = useSelector(state => {
		return state.person
	});
	const disableoption = personalInfo?.ownerId == getOwner();
	const { userProfileAccount } = useSelector((state) => state.user);
	const callClick = (value, name, obj) => {
		setselectButton(value)
		setModuleObj(obj)
		setmoduleName(name)
		setActiveClass("active-tab")
	}

	const handlePerson = (_modalPerson) => {
		setModalPerson(_modalPerson)
	}

	useEffect(() => {
		if (personalInfo) {
			const obj = getRecentTree();
			if (obj?.treeId) {
				let treeIdUser = obj.treeId;
				setTreeId(treeIdUser);
			} else {
				const _innerFun = async () => {
					const trees = await getTreesListAsync(userProfileAccount.id);
					if (trees.length) {
						setTreeId(trees[0].treeId);
					}
				}
				_innerFun();
			}
			if (!personalInfo.treeId) {
				dispatch(treePeopleList({ treeId: null })).then((data) => {
					setHasPerson(data.length !== 0)
				});
			} else {
				setHasPerson(true)
			}


		}
	}, [personalInfo, userProfileAccount])
	const returnvalueinkey = (key) => {
		return key.connectionType === "Other" ? key.customType : key.connectionType
  }
 
	const clickonOne = (realtionshipObj,  keyname, key) => {
		let index = realtionshipObj.findIndex(item => item.personId === key.personId)
				if (index > -1) {
					keyname = returnvalueinkey(key)
					realtionshipObj[index].connection.push(keyname)
					realtionshipObj[index].disabled.push(keyname)
				} else {
					key.connection = []
					key.disabled = []
					keyname = returnvalueinkey(key)
					key.connection.push(keyname)
					key.disabled.push(keyname)
					realtionshipObj.push(key)
				}
	}
	const clickonOther = (realtionshipObj, keyname, key) => {
		let index = realtionshipObj.findIndex(item => item.personId === key.personId)
				if (index > -1) {
					keyname = returnvalueinkey(key)
					if (key.connectionType === "Other") {
						realtionshipObj[index].connection.push(keyname)
					}
				} else {
					key.connection = []
					key.disabled = []
					keyname = returnvalueinkey(key)
					if (key.connectionType === "Other") {
						key.connection.push(keyname)
						realtionshipObj.push(key)
					}
				}
	}
	useEffect(() => {
		let realtionshipObj = []
		let keyname;
		setActiveClass("active-tab")
		if (moduleObj.id === 1) {
			relataionShip.forEach((key) => {
				clickonOne(realtionshipObj,  keyname, key)
			})
			setListData(realtionshipObj)
		} else if (moduleObj.id === 8) {
			relataionShip.forEach((key) => {
				clickonOther(realtionshipObj, keyname, key)
			})
			setListData(realtionshipObj)
		} else {
			setListData(getfilterdata(relataionShip, moduleObj.callingname))
		} 
		relataionShip.forEach((key) => {
			clickonOne(realtionshipObj, keyname, key)
		})
		setdisabledListData(realtionshipObj)
		
	}, [relataionShip,  moduleObj]);

	const setOpenModalFn = (bool, clickAdd = false) => {
		if (bool) {
			const obj = {
				firstName: "",
				lastName: "",
				isLiving: true,
				id: uuidv4(),
				birth: "",
				death: ""
			}
			setModalAction(ADD_NONFAMILY);
			dispatch(addIndividual(obj))
			setAddRelationShipSelected(clickAdd)
		} else {
			setAddRelationShipSelected(false)
			setModalAction(false);
		}
		setOpenModal(bool)
	}
	return <div id="media-page" className="mx-auto w-full max-w-screen-lg px-4 lg:px-28 pt-6 pb-12">
		<div className="cards-wrap">
			<>
				<div className="md:flex justify-between clue-person">
					<div className="relation-left mb-4">
						<div className="tw-left-side-content w-full md:block sm:flex block mx-auto mb-6 sm:mb-0">
							<div className="add-realtionship w-full mb-4">
								{disableoption &&
									<button
										className="text-white rounded-lg bg-blue-4 w-full typo-font-medium px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-3 focus:ring-offset-1 w-auto"
										onClick={() => setOpenModalFn(true, true)}
									> Add Relationship
								</button>
								}
							</div>
							<div className="tw-sidebar-items-wrap w-full relative sm:min-w-60 min-w-full">
								<SideBar callClick={callClick} selectButton={selectButton} activeClass={activeClass} relataionShip={relataionShip} sidebarValue={sidebarValue} moduleName={moduleName} />
							</div>
						</div>
					</div>
					<MainContent treeProfileId={treeProfileId} disableoption={disableoption} value={selectButton} moduleName={moduleName} moduleObj={moduleObj} setOpenModal={setOpenModalFn} relataionShip={listData} name={getName(personalInfo)} />
					{openModal === true && <Modal
						relataionShip={disabledlistData}
						disableoption={disableoption}
						allowTypeahed={true}
						treeProfileId={treeProfileId}
						treeId={personalInfo?.treeId}
						modalAction={modalAction}
						modalTitle={(moduleObj.id === 1 || addRelatioShipSelected) ? "Add a Relationship" : moduleObj.addbutton}
						preSelected={{ pn: { ...personalInfo, name: getName(personalInfo) }, sr: getButtonNameValue(selectButton, addRelatioShipSelected) }}
						setModalAction={setOpenModalFn}
						hasPerson={hasPerson}
						handlePerson={handlePerson}
						modalPersonForm={modalPerson}
					/>
					}
				</div>
			</>
		</div>
	</div>
}

export default Relationships;