import React, { lazy, useRef, useState, Suspense, useEffect } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useSelector } from "react-redux";
//Services
import { removeCookies, getUploadTree, removeUploadTree } from "../services";

// Components
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import PaymentRoute from "./PaymentRoute";
import NewspaperSearch from "./SearchPage/NewspaperSearch";
import ElasticQueryMiddleWare from "../components/ElasticQuery/ElasticQueryMiddleWare";
import ElasticQueryPage from "../components/ElasticQuery/ElasticQueryPage";
import ShareStoryRoute from "./ShareStoryRoute";
// Pages
const HomePage = lazy(() => import("./HomePage"));
const FamilyPage = lazy(() => import("./FamilyPage"));
const ImageViewerPage = lazy(() => import("./ImageViewerPage"));
const PersonViewPage = lazy(() => import("./PersonViewPage"));
const LocationPage = lazy(() => import("./LocationPage"));
const SettingsPage = lazy(() => import("./SettingsPage"));
const PlanPage = lazy(() => import("./SettingsPage/PlanPage"));
const TitleCase = lazy(() => import("./TitleCase"));
const SearchResult = lazy(() => import("./SearchPage/SearchResult"));
const PersonRecords = lazy(() => import("./SearchPage/Person/PersonRecords"));
const RecordsPage = lazy(() => import("./SearchPage/RecordsPage"));
const NewspapperRecords = lazy(() => import("./SearchPage/NewspapperRecords"));
const NewspapperSearchBrowse = lazy(() => import("./SearchPage/NewspapperSearchBrowse"));
const Records = lazy(() => import("./../components/ImageViewer/Records"));
const ViewNews = lazy(() => import("./SearchPage/ViewNews"));
const AddStories = lazy(() => import("./PersonViewPage/stories/addStories"));
const ViewStories = lazy(() => import("./PersonViewPage/stories/ViewStories"));
const ViewImage = lazy(() => import("./ImageViewer"));
const NotFound = lazy(() => import("./NotFound"));
const ErrorBoundaryComponent = lazy(() => import("../components/ErrorBoundaryComponent"));

const UniversalSearchPage = lazy(() => import("./SearchPage/UniversalSearch"));
const WWISearchPage = lazy(() => import("./SearchPage/WWI/pages/SearchPage"));
const WWISearchPageList = lazy(() => import("./SearchPage/WWI/pages/SearchPageList"));
const WWIISearchPage = lazy(() => import("./SearchPage/WWII/pages/SearchPage"));
const WWIISearchPageList = lazy(() => import("./SearchPage/WWII/pages/SearchPageList"));

// US Federal Census
const USCensus1790SearchPage = lazy(() => import("./SearchPage/Census/1790/pages/SearchPage"));
const USCensus1790SearchPageList = lazy(() => import("./SearchPage/Census/1790/pages/SearchPageList"));
const USCensusl1800SearchPage = lazy(() => import("./SearchPage/Census/1800/pages/SearchPage"));
const USCensus1800SearchPageList = lazy(() => import("./SearchPage/Census/1800/pages/SearchPageList"));
const USCensus1810SearchPage = lazy(() => import("./SearchPage/Census/1810/pages/SearchPage"));
const USCensus1810SearchPageList = lazy(() => import("./SearchPage/Census/1810/pages/SearchPageList"));
const USCensus1820SearchPage = lazy(() => import("./SearchPage/Census/1820/pages/SearchPage"));
const USCensus1820SearchPageList = lazy(() => import("./SearchPage/Census/1820/pages/SearchPageList"));
const USCensus1830SearchPage = lazy(() => import("./SearchPage/Census/1830/pages/SearchPage"));
const USCensus1830SearchPageList = lazy(() => import("./SearchPage/Census/1830/pages/SearchPageList"));
const USCensus1840SearchPage = lazy(() => import("./SearchPage/Census/1840/pages/SearchPage"));
const USCensus1840SearchPageList = lazy(() => import("./SearchPage/Census/1840/pages/SearchPageList"));
const USCensus1940SearchPage = lazy(() => import("./SearchPage/Census/1940/pages/SearchPage"));
const USCensus1940SearchPageList = lazy(() => import("./SearchPage/Census/1940/pages/SearchPageList"));
const USCensus1901SearchPage = lazy(() => import("./SearchPage/Census/1901/pages/SearchPage"));
const USCensus1901SearchPageList = lazy(() => import("./SearchPage/Census/1901/pages/SearchPageList"));
const UKCensus1891SearchPage = lazy(() => import("./SearchPage/Census/1891/pages/SearchPage"));
const UKCensus1891SearchPageList = lazy(() => import("./SearchPage/Census/1891/pages/SearchPageList"));
const UKCensus1861SearchPage = lazy(() => import("./SearchPage/Census/1861/pages/SearchPage"));
const UKCensus1861SearchPageList = lazy(() => import("./SearchPage/Census/1861/pages/SearchPageList"));
const UKCensus1851SearchPage = lazy(() => import("./SearchPage/Census/1851/pages/SearchPage"));
const UKCensus1851SearchPageList = lazy(() => import("./SearchPage/Census/1851/pages/SearchPageList"));
const USCensus1881SearchPage = lazy(() => import("./SearchPage/Census/1881/pages/SearchPage"));
const USCensus1881SearchPageList = lazy(() => import("./SearchPage/Census/1881/pages/SearchPageList"));
const USCensus1871SearchPage = lazy(() => import("./SearchPage/Census/1871/pages/SearchPage"));
const USCensus1871SearchPageList = lazy(() => import("./SearchPage/Census/1871/pages/SearchPageList"));
const USCensus1841SearchPage = lazy(() => import("./SearchPage/Census/1841/pages/SearchPage"));
const USCensus1841SearchPageList = lazy(() => import("./SearchPage/Census/1841/pages/SearchPageList"));

// Deaths
const MassachusettsDeathsSearchPage = lazy(() => import("./SearchPage/Deaths/Massachusetts/pages/SearchPage"));
const MassachusettsDeathsSearcgPageList = lazy(() => import("./SearchPage/Deaths/Massachusetts/pages/SearchPageList"));
const OhioDeathsSearchPage = lazy(() => import("./SearchPage/Deaths/Ohio/pages/SearchPage"));
const OhioDeathsSearchPageList = lazy(() => import("./SearchPage/Deaths/Ohio/pages/SearchPageList"));
const NewYorkDeathsSearchPage = lazy(() => import("./SearchPage/Deaths/NewYork/pages/SearchPage"));
const NewYorkDeathsSearchPageList = lazy(() => import("./SearchPage/Deaths/NewYork/pages/SearchPageList"));

// SSDI
const USSocialSecuritySearchPage = lazy(() => import("./SearchPage/SSDI/United States/pages/SearchPage"));
const USSocialSecuritySearchPageList = lazy(() => import("./SearchPage/SSDI/United States/pages/SearchPageList"));

//Immigrants
const RussiansToAmericaPage = lazy(() => import("./SearchPage/Immigrants/RussiansToAmerica/pages/SearchPage"));
const RussiansToAmericaSearchPageList = lazy(() => import("./SearchPage/Immigrants/RussiansToAmerica/pages/SearchPageList"));
const GermanToAmericaSearchPage = lazy(() => import("./SearchPage/Immigrants/GermansToAmerica/pages/SearchPage"));
const GermanToAmericaSearchPageList = lazy(() => import("./SearchPage/Immigrants/GermansToAmerica/pages/SearchPageList"));
const ItaliansToAmericaSearchPage = lazy(() => import("./SearchPage/Immigrants/ItaliansToAmerica/pages/SearchPage"));
const ItaliansToAmericaSearchPageList = lazy(() => import("./SearchPage/Immigrants/ItaliansToAmerica/pages/SearchPageList"));
const IrishSearchPage = lazy(() => import("./SearchPage/Immigrants/Irish/pages/SearchPage"));
const IrishSearchPageList = lazy(() => import("./SearchPage/Immigrants/Irish/pages/SearchPageList"));

//Marriages
const MassachusettsMarriagesSearchPage = lazy(() => import("./SearchPage/Marriages/Massachusetts/pages/SearchPage"));
const MassachusettsMarriagesSearchPageList = lazy(() => import("./SearchPage/Marriages/Massachusetts/pages/SearchPageList"));
const TexasMarriagesSearchPage = lazy(() => import("./SearchPage/Marriages/Texas/pages/SearchPage"));
const TexasMarriagesSearchPageList = lazy(() => import("./SearchPage/Marriages/Texas/pages/SearchPageList"));
const WashingtonMarriagesSearchPage = lazy(() => import("./SearchPage/Marriages/Washington/pages/SearchPage"));
const WashingtonMarriagesSearchPageList = lazy(() => import("./SearchPage/Marriages/Washington/pages/SearchPageList"));
const NYCSearchPage = lazy(() => import("./SearchPage/Marriages/NewYork/pages/SearchPage"));
const NYCSearchPageList = lazy(() => import("./SearchPage/Marriages/NewYork/pages/SearchPageList"));

//War
const CivilWarSearchPage = lazy(() => import("./SearchPage/War/Civil/pages/SearchPage"));
const CivilWarSearchPageList = lazy(() => import("./SearchPage/War/Civil/pages/SearchPageList"));

// Clues
const Clues = lazy(() => import("./Clues"));

// Explore
const Explore = lazy(() => import("./Explore"));
const TopicViewPage = lazy(() => import("./TopicViewPage"));

const PersonProfile = lazy(() => import("./PersonProfile"));

// Footer Pages
const Privacy = lazy(() => import("./Privacy"));
const Terms = lazy(() => import("./Terms"));
const Dpa = lazy(() => import("./Dpa"));
const Ccpa = lazy(() => import("./Ccpa"));

const Stories = lazy(() => import("./Stories"));
const Notifications = lazy(() => import("./../pages/Notifications"));
const PaymentPage = lazy(() => import("./../pages/Payment"));

const AdminTopicPage = lazy(() => import(`./../pages/Admin/TopicPage`));
const AdminHomePage = lazy(() => import(`./../pages/Admin/HomePage`));
const AdminReportPage = lazy(() => import('./../pages/Admin/ReportPage'));

// Share Story
const StoryPreview = lazy(() => import('./../pages/ShareStory/StoryPreview'));
const VerifyStoryPermission = lazy(() => import('./../pages/ShareStory/VerifyStoryPermission'));

const ProtectedRoutes = ({ appErrorState, appError, clearServerErrorState }) => {
  const { showFooter } = useSelector((state) => state.layout);
  const { instance } = useMsal();
  const fileObject = {
    x: 0,
    y: 0,
    zoom: 1,
  };
  const fileInputRef = useRef(null);
  const history = useHistory();
  const anchorRef = React.useRef(null);
  const [selectedFile, setSelectedFile] = useState(fileObject);
  const [imageFile, setImageFile] = useState(null);
  const [accountThumbnail, setAccountThumbnail] = useState(null);
  const [accountFile, setAccountFile] = useState(null);
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [openAccountPopper, setOpenAccountPopper] = useState(false);
  const [errorState, setErrorState] = useState(appErrorState);
  const uploadTreeStatus = getUploadTree();

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/" });
    removeCookies();
  };

  const clearAppErrorState = () => {
    setErrorState(false);
    clearServerErrorState();
  };

  useEffect(() => {
    if (uploadTreeStatus) {
      history.push("/family");
    }
    removeUploadTree();
  }, [history, uploadTreeStatus]);

  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  return (
    <>
      <Header handleLogout={handleLogout} fileInputRef={fileInputRef} selectedFile={selectedFile} setSelectedFile={setSelectedFile} imageFile={imageFile} setImageFile={setImageFile} setAccountThumbnail={setAccountThumbnail} accountThumbnail={accountThumbnail} anchorRef={anchorRef} showInvalidModal={showInvalidModal} setShowInvalidModal={setShowInvalidModal} openAccountPopper={openAccountPopper} setOpenAccountPopper={setOpenAccountPopper} accountFile={accountFile} setAccountFile={setAccountFile} clearAppErrorState={clearAppErrorState} />

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Loader />
          </div>
        }
      >
        <ElasticQueryMiddleWare />

        <ScrollToTop />

        <Switch>
          {(errorState || appError) && <Route component={ErrorBoundaryComponent} />}
          <Route exact path="/" component={HomePage} />
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/family" component={FamilyPage} />
          <Route exact path="/family/:addPerson" component={FamilyPage} />
          <Route exact path="/settings" component={SettingsPage} />
          <Route exact path="/settings/:getTab" component={SettingsPage} />
          <Route exact path="/plans" component={PlanPage} />
          <Route exact path="/family/pedigree-view/:treeId/:primaryPersonId/:level" component={FamilyPage} />
          <Route exact path="/family/pedigree-view/:treeId/:primaryPersonId/:level/:addPerson" component={FamilyPage} />
          <Route exact path="/family/person-page/:treeId/:primaryPersonId" component={PersonViewPage} />
          <Route exact path="/family/person-page/:treeId/:primaryPersonId/:authorId" component={PersonViewPage} />
          <Route exact path="/search/person-records/:personId" component={PersonRecords} />
          <Route exact path="/search/records" component={RecordsPage} />
          <Route exact path="/search" component={UniversalSearchPage} />
          <Route exact path="/ssdi/*" component={ImageViewerPage} />
          <Route exact path="/census/:household/:householdId/:personId?" component={ImageViewerPage} />
          <Route exact path="/ut/*" component={ImageViewerPage} />
          <Route exact path="/test" component={LocationPage} />
          <Route exact path="/titlecase" component={TitleCase} />
          <Route exact path="/records/:recordId/:partitionKey" component={Records} />
          <Route exact path="/stories/add/:refType/:treeId/:primaryPersonId" component={AddStories} />
          <Route exact path="/stories/view/:refType/:storyId/:treeId/:primaryPersonId" component={ViewStories} />
          <Route exact path="/media/view-image/:mediaId" component={ViewImage} />
          <Route exact path="/media/view-image/:mediaId/:newspaper" component={ViewImage} />
          <Route exact path="/stories/view-image/:mediaId/:refType" component={ViewImage} />
          <Route exact path="/stories/edit/:refType/:storyId/:treeId/:primaryPersonId" component={AddStories} />
          <Route exact path="/stories/add/newspaper/:recordId" component={AddStories} />
          <Route exact path="/stories/add/:refType" component={AddStories} />
          <Route exact path="/stories/view/:refType/:storyId" component={ViewStories} />
          <Route exact path="/stories/view/:refType/:storyId?newspaper" component={ViewStories} />
          <Route exact path="/stories/edit/:refType/:storyId" component={AddStories} />
          <Route exact path="/stories/add-from-media/:refType/:mediaId" component={AddStories} />
          <Route exact path="/stories/add-from-external-media/:refType/:mediaId/:recordId" render={(props) => <AddStories newspaper={true} {...props} />} />
          <Route exact path="/stories" component={Stories} />
          <Route exact path="/stories/:treeId/:primaryPersonId" component={Stories} />
          <Route exact path="/notifications" component={Notifications} />

          <Route exact path="/search/all-historical-records/result" component={SearchResult} />
          <Route exact path="/search/world-war-i-casualties" component={WWISearchPage} />
          <Route exact path="/search/world-war-i-casualties/result" component={WWISearchPageList} />
          <Route exact path="/search/world-war-ii-army-enlistments/result" component={WWIISearchPageList} />
          <Route exact path="/search/world-war-ii-army-enlistments" component={WWIISearchPage} />

          {/*US Federal Census */}
          <Route exact path="/search/1790-united-states-federal-census" component={USCensus1790SearchPage} />
          <Route exact path="/search/1790-united-states-federal-census/result" component={USCensus1790SearchPageList} />
          <Route exact path="/search/1800-united-states-federal-census" component={USCensusl1800SearchPage} />
          <Route exact path="/search/1800-united-states-federal-census/result" component={USCensus1800SearchPageList} />
          <Route exact path="/search/1810-united-states-federal-census" component={USCensus1810SearchPage} />
          <Route exact path="/search/1810-united-states-federal-census/result" component={USCensus1810SearchPageList} />
          <Route exact path="/search/1820-united-states-federal-census" component={USCensus1820SearchPage} />
          <Route exact path="/search/1820-united-states-federal-census/result" component={USCensus1820SearchPageList} />
          <Route exact path="/search/1830-united-states-federal-census" component={USCensus1830SearchPage} />
          <Route exact path="/search/1830-united-states-federal-census/result" component={USCensus1830SearchPageList} />
          <Route exact path="/search/1840-united-states-federal-census" component={USCensus1840SearchPage} />
          <Route exact path="/search/1840-united-states-federal-census/result" component={USCensus1840SearchPageList} />
          <Route exact path="/search/1940-united-states-federal-census" component={USCensus1940SearchPage} />
          <Route exact path="/search/1940-united-states-federal-census/result" component={USCensus1940SearchPageList} />
          <Route exact path="/search/1901-united-kingdom-census" component={USCensus1901SearchPage} />
          <Route exact path="/search/1901-united-kingdom-census/result" component={USCensus1901SearchPageList} />
          <Route exact path="/search/1891-united-kingdom-census" component={UKCensus1891SearchPage} />
          <Route exact path="/search/1891-united-kingdom-census/result" component={UKCensus1891SearchPageList} />
          <Route exact path="/search/1861-united-kingdom-census" component={UKCensus1861SearchPage} />
          <Route exact path="/search/1861-united-kingdom-census/result" component={UKCensus1861SearchPageList} />
          <Route exact path="/search/1851-united-kingdom-census" component={UKCensus1851SearchPage} />
          <Route exact path="/search/1851-united-kingdom-census/result" component={UKCensus1851SearchPageList} />
          <Route exact path="/search/1881-united-kingdom-census" component={USCensus1881SearchPage} />
          <Route exact path="/search/1881-united-kingdom-census/result" component={USCensus1881SearchPageList} />
          <Route exact path="/search/1871-united-kingdom-census" component={USCensus1871SearchPage} />
          <Route exact path="/search/1871-united-kingdom-census/result" component={USCensus1871SearchPageList} />
          <Route exact path="/search/1841-united-kingdom-census" component={USCensus1841SearchPage} />
          <Route exact path="/search/1841-united-kingdom-census/result" component={USCensus1841SearchPageList} />

          {/* Deaths */}
          <Route exact path="/search/massachusetts-state-deaths" component={MassachusettsDeathsSearchPage} />
          <Route exact path="/search/massachusetts-state-deaths/result" component={MassachusettsDeathsSearcgPageList} />
          <Route exact path="/search/ohio-state-deaths" component={OhioDeathsSearchPage} />
          <Route exact path="/search/ohio-state-deaths/result" component={OhioDeathsSearchPageList} />
          <Route exact path="/search/new-york-state-deaths" component={NewYorkDeathsSearchPage} />
          <Route exact path="/search/new-york-state-deaths/result" component={NewYorkDeathsSearchPageList} />

          {/* SSDI */}
          <Route exact path="/search/united-states-social-security-death-index" component={USSocialSecuritySearchPage} />
          <Route exact path="/search/united-states-social-security-death-index/result" component={USSocialSecuritySearchPageList} />

          {/* Immigrants */}
          <Route exact path="/search/russian-immigrants" component={RussiansToAmericaPage} />
          <Route exact path="/search/russian-immigrants/result" component={RussiansToAmericaSearchPageList} />
          <Route exact path="/search/german-immigrants" component={GermanToAmericaSearchPage} />
          <Route exact path="/search/german-immigrants/result" component={GermanToAmericaSearchPageList} />
          <Route exact path="/search/italian-immigrants" component={ItaliansToAmericaSearchPage} />
          <Route exact path="/search/italian-immigrants/result" component={ItaliansToAmericaSearchPageList} />
          <Route exact path="/search/irish-famine-passenger-records" component={IrishSearchPage} />
          <Route exact path="/search/irish-famine-passenger-records/result" component={IrishSearchPageList} />

          {/* Marriages */}
          <Route exact path="/search/massachusetts-state-marriages" component={MassachusettsMarriagesSearchPage} />
          <Route exact path="/search/massachusetts-state-marriages/result" component={MassachusettsMarriagesSearchPageList} />
          <Route exact path="/search/texas-marriages" component={TexasMarriagesSearchPage} />
          <Route exact path="/search/texas-marriages/result" component={TexasMarriagesSearchPageList} />
          <Route exact path="/search/washington-state-marriages" component={WashingtonMarriagesSearchPage} />
          <Route exact path="/search/washington-state-marriages/result" component={WashingtonMarriagesSearchPageList} />
          <Route exact path="/search/new-york-city-marriages" component={NYCSearchPage} />
          <Route exact path="/search/new-york-city-marriages/result" component={NYCSearchPageList} />

          {/* War */}
          <Route exact path="/search/us-civil-war-soldiers" component={CivilWarSearchPage} />
          <Route exact path="/search/us-civil-war-soldiers/result" component={CivilWarSearchPageList} />

          {/**Newspapper link */}
          <Route exact path="/search/newspapers" component={NewspaperSearch} />
          <Route exact path="/search/newspapers/result" component={NewspapperRecords} />
          <Route exact path="/search/newspapers/browse" component={NewspapperSearchBrowse} />
          <Route exact path="/search/newspaper/:recordId" component={ViewNews} />

          {/** Newspaper location links */}
          <Route exact path="/search/location" component={NewspapperSearchBrowse} />
          <Route exact path="/search/location/:countryName" component={NewspapperSearchBrowse} />
          <Route exact path="/search/location/:countryName/:stateName" component={NewspapperSearchBrowse} />
          <Route exact path="/search/location/:countryName/:stateName/:cityName" component={NewspapperSearchBrowse} />
          <Route exact path="/search/location/:countryName/:stateName/:cityName/:publicationName" component={NewspapperSearchBrowse} />
          {/* Clues */}
          <Route exact path="/clues" component={Clues} />

          <Route exact path="/person/profile/:primaryPersonId" component={PersonProfile} />

          {/* Explore */}
          <Route exact path="/explore" component={Explore} />
          {/* <Route exact path="/explore/topic/:topicName" component={TopicViewPage} /> */}

          {/* <Route  path="/explore/topic/:topicName/:subChildTopic?/:childTopic?" component={TopicViewPage} /> */}

          <Route path="/explore/topic" component={TopicViewPage} />

          {/* Footer Pages */}
          <Route exact path="/privacy" component={Privacy} />
          <Route exact path="/terms" component={Terms} />
          <Route exact path="/dpa" component={Dpa} />
          <Route exact path="/ccpa" component={Ccpa} />
          <ShareStoryRoute exact path="/story-preview/:storyId" component={StoryPreview} />
          <ShareStoryRoute exact path="/verify-story-permission" component={VerifyStoryPermission} />

          <PaymentRoute exact path="/payment" component={PaymentPage} />
          <PaymentRoute exact path="/payment/:planName" component={PaymentPage} />
          <Route exact path="/admin/topics" component={AdminTopicPage} />
          <Route exact path="/admin/report" component={AdminReportPage} />
          {/* Admin Pages */}
          <Route path="/admin" component={AdminHomePage} />
          {/*   Elastic Query */}
          <Route path="/elasticquery" component={ElasticQueryPage} />

          <Route component={NotFound} />
        </Switch>
      </Suspense>

      {showFooter && <Footer />}
    </>
  );
};

export default ProtectedRoutes;
