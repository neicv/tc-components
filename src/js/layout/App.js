import m from 'mithril';
import MainPage from "./MainPage.js";
import NavBar from "./NavBar.js";

const App = {
    view: ({ children }) => (
        <div class="app">
            <NavBar />
            <MainPage> {children}</MainPage>
        </div>
    )
};
export default App;
