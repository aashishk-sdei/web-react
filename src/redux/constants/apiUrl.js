export const API_BASEPATH = "https://stage.newspaperarchive.com/api/";
export const API_BASEPATH_NEWSPAPER = process.env.REACT_APP_API_BASEPATH_NEWSPAPER;
export const STORIED_TEST_URL = "https://api.test.storied.com";
export const STORIED_BASE_URL = process.env.REACT_APP_API;
export const IMAGEAPIURL = "https://imgapi.storied.com";
export const PAYMENT_BASE_URL = process.env.REACT_APP_PAYMENT_URL;
export const LOGIN = `${API_BASEPATH}admin/login`;
export const CONTENTSEARCH = `${STORIED_BASE_URL}/api/contentsearch`;
export const WWISEARCH = `${STORIED_BASE_URL}/api/wwi`;
export const WW2SEARCH = `${STORIED_BASE_URL}/api/war/wwii`;
export const CIVILWAR = `${STORIED_BASE_URL}/api/war/civil`;
export const PLACEAUTHIRITY = `${STORIED_BASE_URL}/api/placeauthority/lookup`;
export const PLACEAUTHIRITYALL = `${STORIED_BASE_URL}/api/PlaceAuthority/lookup`;
export const userTrees = () => `${STORIED_BASE_URL}/api/Users/trees`;
export const updateTreeName = () => `${STORIED_BASE_URL}/api/Trees/treename`;
export const treePeople = (treeId) => `${STORIED_BASE_URL}/api/Trees/${treeId}/listPeople`;
export const getAllPersons = `${STORIED_BASE_URL}/api/Users/listAllPeople`;
export const viewRecord = ({ recordId, partitionKey }) => `${STORIED_BASE_URL}/api/recorddetail/${recordId}/${partitionKey}`;
export const saveToTreeApi = ({ personId }) => `${STORIED_BASE_URL}/api/Persons/${personId}/saverecord`;
export const researchSavedRecord = ({ primaryPersonId }) => `${STORIED_BASE_URL}/api/Persons/${primaryPersonId}/personrecords`;
export const saveStoryApi = `${STORIED_BASE_URL}/api/story`;
export const editStoryApi = `${STORIED_BASE_URL}/api/Story/editstory`;
export const viewStory = ({ storyId }) => `${STORIED_BASE_URL}/api/Story/${storyId}`;
export const updateStoryIsLiked = ({ storyId, isLiked }) => `${STORIED_BASE_URL}/api/Story/${storyId}/${isLiked}`;
export const storylikespersons = ({ storyId, pageNumber = 1, pageSize = 30 }) => `${STORIED_BASE_URL}/api/Story/storylikesdetail/${storyId}/${pageNumber}/${pageSize}`;
export const getStories = ({ personId, authorId, pageNumber = 1, pageSize = 10 }) => `${STORIED_BASE_URL}/api/persons/${personId}/${pageNumber}/${pageSize}/PersonStories${authorId ? "?authorId=" + authorId : ""}`;
export const getMemberStories = ({ personId, pageNumber = 1, pageSize = 10 }) => `${STORIED_BASE_URL}/api/Users/${personId}/${pageNumber}/${pageSize}/memberStories`;

export const deleteStoryPerson = `${STORIED_BASE_URL}/api/Story/removetaggedperson`;
export const updatePrivacyStatus = `${STORIED_BASE_URL}/api/story/updateprivacy`;
export const collectionDropDown = `${STORIED_BASE_URL}/api/ContentCatalog`;
export const eventDropDown = `${STORIED_BASE_URL}/api/ContentCatalog/event`;
export const deleteStory = (StoryId) => `${STORIED_BASE_URL}/api/Story/${StoryId}/delete`;
export const getContentCatalog = ({ partitionKey }) => `${STORIED_BASE_URL}/api/ContentCatalog/${partitionKey}`;
export const USFEDERALCENSUSSEARCH = `${STORIED_BASE_URL}/api/Census`;
export const getLeftPanelDetails = ({ personId, authorId }) => `${STORIED_BASE_URL}/api/persons/${personId}/personstoriescountbycategories${authorId ? "?authorId=" + authorId : ""}`;
export const getLeftPanelDetailsOwner = () => `${STORIED_BASE_URL}/api/Users/authorstoriescountbycategories`;
export const getLeftPanelDetailsMember = ({ memberId }) => `${STORIED_BASE_URL}/api/Users/${memberId}/memberStoriesCountByCategory`;

export const getImmediateFamily = ({ treeId, personId }) => `${STORIED_BASE_URL}/api/Persons/immediatefamily?treeId=${treeId}&personId=${personId}`;
export const getHomepageStories = ({ pageNumber = 1, pageSize = 10 }) => `${STORIED_BASE_URL}/api/users/stories/${pageNumber}/${pageSize}`;
export const getOwnStories = ({ pageNumber = 1, pageSize = 10 }) => `${STORIED_BASE_URL}/api/users/${pageNumber}/${pageSize}/authorstories`;
export const getStoriesCount = () => `${STORIED_BASE_URL}/api/Users/authorstoriescount `;
export const getTreesList = () => `${STORIED_BASE_URL}/api/Users/trees`;
export const getNewsPaperFreeViewsCount = () => `${STORIED_BASE_URL}/api/UserViews/newspaperfreeviewscount`;
export const registerUpdateNewsPaperView = (pageURL) => `${STORIED_BASE_URL}/api/UserViews/registernewspaperview/${pageURL}`;
export const getTreesASYNC = () => `Users/trees`;
export const getImageFromImageId = `${IMAGEAPIURL}/StoriedThumbnail`;
export const RUSSIANSEARCH = `${STORIED_BASE_URL}/api/Immigrants/RussianToAmerica`;
export const getFormDropdowns = (formGUID) => `${STORIED_BASE_URL}/api/search/forms/${formGUID}/dropdowns`;
export const IRISHSEARCH = `${STORIED_BASE_URL}/api/Immigrants/Irish`;
export const getRecentPeople = () => `${STORIED_BASE_URL}/api/Users/recentpeoplecard`;
export const GERMANTOAMERICANSEARCH = `${STORIED_BASE_URL}/api/Immigrants/GermanToAmerica`;
export const ITALIANSTOAMERICANSEARCH = `${STORIED_BASE_URL}/api/Immigrants/ItalianstoAmerica`;
export const USSOCIALSECURITY = `${STORIED_BASE_URL}/api/Deaths/Ssdi`;
export const MASSACHUSSETS = `${STORIED_BASE_URL}/api/Deaths/Massachusetts`;
export const NYDEATHS = `${STORIED_BASE_URL}/api/Deaths/NewYork`;
export const USCENSUS = `${STORIED_BASE_URL}/api/census/1790`;
export const getMedia = ({ mediaId }) => `${STORIED_BASE_URL}/api/media/${mediaId} `;
export const getExternalMedia = ({ mediaId }) => `${STORIED_BASE_URL}/api/Media/naclippingdetail/${mediaId}`;
export const NYC = `${STORIED_BASE_URL}/api/Marriages/NewYork`;
export const UPDATEMEDIAMETADATA = `${STORIED_BASE_URL}/api/media/updatemediametadata`;
export const getUserDetail = ({ userId }) => `${STORIED_BASE_URL}/api/users/${userId}/userdetail`;

export const ADDPERSONTOMEDIA = `${STORIED_BASE_URL}/api/media/addpersonstomedia`;
export const REMOVEPERSONFROMMEDIA = `${STORIED_BASE_URL}/api/media/removepersonsfrommedia`;
export const TEXASMARRIAGESSEARCH = `${STORIED_BASE_URL}/api/Marriages/Texas`;
export const getNotifications = `${STORIED_BASE_URL}/api/Users/notifications`;
export const getUserInfo = (userid) => `${STORIED_BASE_URL}/api/Users/${userid}/info`;
export const MarkedRead = `${STORIED_BASE_URL}/api/User/marknotificationread`;
export const SubmitSubscriptionInfo = `${STORIED_BASE_URL}/api/User/subscriptioninfo`;
export const GetSubscriptionInfo = `${STORIED_BASE_URL}/api/Users/subscriptioninfo`;
export const SUBMITCARDDETAILS = `${PAYMENT_BASE_URL}/api/Account/StoriedCreditCardProcessing`;
export const UPGRADECARDDETAILS = `${PAYMENT_BASE_URL}/api/Account/ChangeSubscription`;
export const TAXAPIDETAILS = `${PAYMENT_BASE_URL}/api/Payment/GetAvalaraTaxByAddress`;
export const USFEDERAL1800SEARCH = `${STORIED_BASE_URL}/api/Census/1800`;
export const WASHINGTONMARRAGES = `${STORIED_BASE_URL}/api/Marriages/Washington`;
export const USFEDERALCENSUS1810 = `${STORIED_BASE_URL}/api/Census/1810`;
export const USFEDERALCENSUS1820 = `${STORIED_BASE_URL}/api/Census/1820`;
export const USFEDERALCENSUS1830 = `${STORIED_BASE_URL}/api/Census/1830`;
export const USFEDERALCENSUS1840 = `${STORIED_BASE_URL}/api/Census/1840`;
export const USFEDERALCENSUS1901 = `${STORIED_BASE_URL}/api/Census/1901`;
export const USFEDERALCENSUS1881 = `${STORIED_BASE_URL}/api/Census/1881`;
export const USFEDERALCENSUS1871 = `${STORIED_BASE_URL}/api/Census/1871`;
export const UKFEDERALCENSUS1891 = `${STORIED_BASE_URL}/api/Census/1891`;
export const UKFEDERALCENSUS1861 = `${STORIED_BASE_URL}/api/Census/1861`;
export const UKFEDERALCENSUS1851 = `${STORIED_BASE_URL}/api/Census/1851`;
export const UKFEDERALCENSUS1841 = `${STORIED_BASE_URL}/api/Census/1841`;
export const MMSEARCH = `${STORIED_BASE_URL}/api/Marriages/Massachusetts`;
export const PERSONCLUEAPI = ({ personId }) => `${STORIED_BASE_URL}/api/persons/${personId}/personsclue`;
export const COUNTRY = `${STORIED_BASE_URL}/api/NewsPaperSearch/countries`;
export const getState = (countryId) => `${STORIED_BASE_URL}/api/NewsPaperSearch/statebycountryid/${countryId}`;
export const getCity = (stateId) => `${STORIED_BASE_URL}/api/NewsPaperSearch/citiesbystateid/${stateId}`;
export const getPublication = (cityId, stateId) => `${STORIED_BASE_URL}/api/NewsPaperSearch/pubtitlebycityid/${stateId}/${cityId}`;
export const PERSONRRECORDSAPI = (personId) => `${STORIED_BASE_URL}/api/persons/${personId}/contentsearch`;
export const getADB2CUserInfo = (userid) => `${STORIED_BASE_URL}/api/Users/${userid}/adb2cinfo`;
export const getPublications = `${STORIED_BASE_URL}/api/NewsPaperSearch/newspapersearch`;
export const updateLastTimeUserSawNotification = `${STORIED_BASE_URL}/api/User/updatelasttimeusersawnotification`;
export const OHIODEATHS = `${STORIED_BASE_URL}/api/Deaths/Ohio`;

export const getFollowers = `${STORIED_BASE_URL}/api/Users/followers`;
export const getFollowings = `${STORIED_BASE_URL}/api/Users/following`;
export const setfollowUser = `${STORIED_BASE_URL}/api/User/follow`;
export const setUnfollowUser = `${STORIED_BASE_URL}/api/User/unfollow`;
export const getFollowUnfollowCount = `${STORIED_BASE_URL}/api/Users/followingfollowersCount`;
export const getFollowUnfollowDetail = `${STORIED_BASE_URL}/api/Users/followingstatusInfo`;
export const SEARCHPEOPLE = (reqId, page, str) => `${STORIED_BASE_URL}/api/users/typeahead/search/${reqId}/page/${page}/${str}`;
export const personInformation = (personId) => `${STORIED_BASE_URL}/api/Persons/${personId}/info`;
export const assignTopicToStory = ({ storyId, topicId }) => `${STORIED_BASE_URL}/api/admin/Story/${storyId}/assign/${topicId}`;
export const removeTopicFromStory = ({ storyId, topicId }) => `${STORIED_BASE_URL}/api/admin/Story/${storyId}/remove/${topicId}`;
export const getAdminStories = ({ pageNumber = 1, pageSize = 10 }) => `${STORIED_BASE_URL}/api/admin/Story/allstories/${pageNumber}/${pageSize}`;
export const viewAdminStory = ({ storyId }) => `${STORIED_BASE_URL}/api/Story/${storyId}`;
export const getAdminStoriesCount = `${STORIED_BASE_URL}/api/admin/Story/adminstoriescount `;
export const GetTopics = () => `${STORIED_BASE_URL}/api/topic`;
export const GetTopicByName = (topicName) => `${STORIED_BASE_URL}/api/topic/name/${topicName}`;
export const GetStoriesByTopic = ({ topicId, requestId, pageNumber = 1, pageSize = 10 }) => `${STORIED_BASE_URL}/api/topic/${topicId}/stories/${requestId}/${pageNumber}/${pageSize}`;
export const GetPublishedTitleByGUID = (GUID) => `${API_BASEPATH_NEWSPAPER}/getpublicationtitle/?topicGuid=${GUID}`;
export const followTopic = (topicId) => `${STORIED_BASE_URL}/api/user/followtopic/${topicId}`;
export const unFollowTopic = (topicId) => `${STORIED_BASE_URL}/api/user/unfollowtopic/${topicId}`;
export const getFollowedTopics = `${STORIED_BASE_URL}/api/users/followingtopics`;
export const getTopicbyId = (topicId) => `${STORIED_BASE_URL}/api/topic/id/${topicId}`;
export const milopreferences = `${STORIED_BASE_URL}/api/User/milopreferences`;
export const milopreferencesupdate = `${STORIED_BASE_URL}/api/User/milopreferencesupdate`;
export const ccpa = `${STORIED_BASE_URL}/api/User/ccpa`;
export const yearRange = `${STORIED_BASE_URL}/api/NewsPaperSearch/yearsrangebylocation`;

export const isUserEmailWhitelist = (email) => `${STORIED_BASE_URL}/api/Whitelist/IsInWhitelist?email=${email}`;
export const addUserToWaitList = (userName, userEmail) => `${STORIED_BASE_URL}/api/Waitlist/AddToWaitList?name=${userName}&email=${userEmail}`;
export const checkADB2CUserByEmail = (userEmail) => `${STORIED_BASE_URL}/api/Users/${userEmail}/checkadb2cbyemail`;
export const getComments = (pageNumber, pageSize, storyId) => `${STORIED_BASE_URL}/api/Story/${storyId}/comments/${pageNumber}/${pageSize}`
export const addComments = () => `${STORIED_BASE_URL}/api/Story/comment`
export const countcomments = (storyId) => `${STORIED_BASE_URL}/api/Story/${storyId}/commentcount`

export const publicationCount = `${STORIED_BASE_URL}/api/NewsPaperSearch/newspaperandpubcount`;
export const publicationYears = `${STORIED_BASE_URL}/api/NewsPaperSearch/publicationyears`;
export const publicationYearsMonth = `${STORIED_BASE_URL}/api/NewsPaperSearch/publicationmonths`;
export const publicationYearsMonthDate = `${STORIED_BASE_URL}/api/NewsPaperSearch/publicationdates`;

export const CalculateRefundAmount = (planID, startDate) => `${PAYMENT_BASE_URL}/api/Account/CalculateRefundAmount?planId=${planID}&startDate=${startDate}`;
export const ChangeSubscription = `${PAYMENT_BASE_URL}/api/Account/ChangeSubscription`;
export const GetBillingInformation = (recurlyUuid) => `${PAYMENT_BASE_URL}/api/Account/GetBillingInformation?recurlyUuid=${recurlyUuid}`;
export const cancelSubscription = () => `${PAYMENT_BASE_URL}/api/Account/CancelSubscription`;
export const UpdatePaymentCard = () => `${PAYMENT_BASE_URL}/api/Account/UpdatePaymentCard`;
export const COUNTRYWITHABBR = `${PAYMENT_BASE_URL}/api/Account/GetCountryList`;
export const FEATUREFLAG = `${STORIED_BASE_URL}/api/FeatureFlag/feature`

export const shareStoriesViaEmail = `${STORIED_BASE_URL}/api/Story/sharestory`
export const shareStoryViewStatus = (invitationId, visitorId) => `${STORIED_BASE_URL}/api/ShareStory/previewstatus?invitationId=${invitationId}&visitorId=${visitorId}`
export const addToStoryPreviewers = `${STORIED_BASE_URL}/api/ShareStory/addpreviewer`
export const assignUserToStory = (storyId) => `${STORIED_BASE_URL}/api/Story/${storyId}/addassociation`
export const previewStoryDetails = (storyId) => `${STORIED_BASE_URL}/api/Story/previewstory/${storyId}`
export const addEmailsToWhiteList = `${STORIED_BASE_URL}/api/Whitelist/AddToWhitelist`
export const checkVisitorStoryPermission = (visitorId, storyId) => `${STORIED_BASE_URL}/api/ShareStory/checkvisitorstorypermission?visitorId=${visitorId}&storyId=${storyId}`
export const checkUserAssociation = (storyId) => `${STORIED_BASE_URL}/api/Story/${storyId}/checkuserassociation`
export const viewStoryViaInvitation = (storyId) => `${STORIED_BASE_URL}/api/Story/viewstory/${storyId}`
export const nonLoginUserDetails = (userID) => `${STORIED_BASE_URL}/api/Users/${userID}/detail`