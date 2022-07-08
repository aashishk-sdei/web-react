import Translator from "../../components/Translator";

export const personalInfoMenu = [
    {
        id: 1,
        name: <Translator tkey="person.menu.marriage"/>
    },
    {
        id: 2,
        name: <Translator tkey="person.menu.divorce"/>
    },
    {
        id: 3,
        name: <Translator tkey="person.menu.funeral"/>
    },
    {
        id: 4,
        name: <Translator tkey="person.menu.burial"/>
    },
    {
        id: 5,
        name: <Translator tkey="person.menu.cremation"/>
    },
    {
        id: 6,
        name: <Translator tkey="person.menu.other"/>
    }
];

export const familyMenu = [
    {
        id: 7,
        name: <Translator tkey="person.menu.parent"/>
    },
    {
        id: 8,
        name: <Translator tkey="person.menu.spouse"/>
    },
    {
        id: 9,
        name: <Translator tkey="person.menu.sibling"/>
    },
    {
        id: 10,
        name: <Translator tkey="person.menu.child"/>
    }
];

export const lifeEventsMenu = [
    {
        id: 11,
        name: "Birth"
    },
    {
        id: 12,
        name: "Marriage"
    },
    {
        id: 13,
        name: "Death"
    },
    {
        id: 14,
        name: "Adoption"
    },
    {
        id: 15,
        name: "Annulment"
    },
    {
        id: 16,
        name: "Arrival"
    },
    {
        id: 17,
        name: "Baptism"
    },
    {
        id: 18,
        name: "Bar Mitzvah"
    },
    {
        id: 19,
        name: "Burial"
    },
    {
        id: 20,
        name: "Christening"
    },
    {
        id: 21,
        name: "Departure"
    },
    {
        id: 22,
        name: "Destination"
    },
    {
        id: 23,
        name: "Divorce"
    },
    {
        id: 24,
        name: "Divorce Filed"
    },
    {
        id: 25,
        name: "Education"
    },
    {
        id: 26,
        name: "Emigration"
    },
    {
        id: 27,
        name: "Employment"
    },
    {
        id: 28,
        name: "Engagement"
    },
    {
        id: 29,
        name: "First Communion"
    },
    {
        id: 30,
        name: "Graduation"
    },
    {
        id: 31,
        name: "Immigration"
    },
    {
        id: 32,
        name: "Marriage Bann"
    },
    {
        id: 33,
        name: "Marriage Contract"
    },
    {
        id: 34,
        name: "Marriage License"
    },
    {
        id: 35,
        name: "Marriage Settlement"
    },
    {
        id: 36,
        name: "Military"
    },
    {
        id: 37,
        name: "Naturalization"
    },
    {
        id: 38,
        name: "Probate"
    },
    {
        id: 39,
        name: "Residence"
    },
    {
        id: 40,
        name: "Separation"
    },
];

export const nonSelectableMenu = [
    {
        id: 1,
        name: "Birth"
    },
    {
        id: 2,
        name: "Adoption"
    }
];

export const photoMenu = [
    {   
        id: 1,
        name: <Translator tkey="person.menu.photo.viewProfilePhoto"/>
    },
    {   
        id: 2,
        name: <Translator tkey="person.menu.photo.resizeProfilePhoto"/>
    },
    {   id: 3,
        name: <Translator tkey="person.menu.photo.chooseNewProfilePhoto"/>
    },
    {   id: 4,
        name: <Translator tkey="person.menu.photo.removeProfilePhoto"/>
    }
]
export const accountMenu = [
    {   
        id: 1,
        icon: "setting",
        name: <Translator tkey="accountMenu.Settings"/>
    },
    {   id: 2,
        icon: "logout",
        name: <Translator tkey="accountMenu.Logout"/>
    }
]

export const settingsMenu = [
    {   
        id: 1,
        icon: "profile-circle",
        title: <Translator tkey="settingsMenu.Profile"/>
    },
    {   
        id: 2,
        icon:"trees",
        title:<Translator tkey="settingsMenu.Trees"/>
    },
    {   
        id: 3,
        icon:"card",
        title:<Translator tkey="settingsMenu.Billing"/>
    },
    // {   
    //     id: 4,
    //     icon:"privacy",
    //     title:<Translator tkey="settingsMenu.Privacy"/>
    // },
    // {   
    //     id: 5,
    //     icon:"envolope",
    //     title:<Translator tkey="settingsMenu.Notifications"/>
    // },
    {   
        id: 6,
        icon:"envolope",
        title:<Translator tkey="settingsMenu.Communication"/>
    },
]

export const heroPhotoMenu = [
    {   
        id: 1,
        name: <Translator tkey="person.menu.photo.viewBackgroundPhoto"/>
    },
    {   
        id: 2,
        name: <Translator tkey="person.menu.photo.resizeBackgroundPhoto"/>
    },
    {   id: 3,
        name: <Translator tkey="person.menu.photo.chooseNewBackgroundPhoto"/>
    },
    {   id: 4,
        name: <Translator tkey="person.menu.photo.removeBackgroundPhoto"/>
    }
]


export const stickyHeaderMenu = [
    {   
        id: 1,
        name: "Search Records"
    },
    {   id: 2,
        name: "View in Tree"
    },
    {   id: 4,
        name: "Delete Person"
    }
]

export const rowInteractionMenu = (name) => {
    return [ {   
        id: 1,
        name: `View ${name}`
    },
    {   id: 2,
        name: <Translator tkey="person.menu.ViewTree"/>
    },
    {   id: 3,
        name: <Translator tkey="person.menu.deletePerson"/>
    }]
}

export const rowInteractionMenuForEvent = [{ id: 4, name: <Translator tkey="person.menu.deleteEvent"/> }];

export const mobileRowInteractionMenu = (name) => {
    return [
    {   
        id: 5,
        name: <Translator tkey="person.menu.editName"/>
    },
    {   id: 1,
        name: `View ${name}`
    },
    {   id: 2,
        name: <Translator tkey="person.menu.ViewTree"/>
    },
    {   id: 3,
        name: <Translator tkey="person.menu.deletePerson"/>
    }
]}