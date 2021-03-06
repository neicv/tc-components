/* eslint-disable */
import stream from "mithril/stream";
import {
    createStore as createReduxStore,
    applyMiddleware,
    combineReducers,
    bindActionCreators
} from "redux";

/**
 * Mithril module reference. This is to ensure that the same redraw loop and internal module handling is in fact exact
 * to the application itself.
 * @type {Function}
 */
let m = null;

let unsubscribeRedraw = null;

/**
 * Initialize the library to utilize the exact reference to mithril as the base application
 * @param  {Function} mithrilModule reference to the application's mithril instance
 */
export const init = mithrilModule => {
    m = mithrilModule;
};

/**
 * Provider function that returns configured store
 *
 * @returns {Function}
 */
export const store = stream(null);

/**
 * Generates a new action creator for dispatching requests.
 *
 * @param type
 * @param argNames
 * @returns {Function}
 */
export const makeActionCreator = (type, ...argNames) => (...args) => {
    const action = { type };
    argNames.forEach((arg, index) => {
        action[argNames[index]] = args[index];
    });
    return action;
};

/**
 *  Generates a new reducer for handling action requests
 *
 * @param initialState
 * @param handlers
 * @returns {Function}
 */
export const createReducer = (initialState, handlers) => (
    state = initialState,
    action
) => {
    if (handlers.hasOwnProperty(action.type)) {
        return handlers[action.type](state, action);
    } else {
        return state;
    }
};

/**
 * Default prop to store mapping
 *
 * @param state
 * @param props
 */
export const defaultMapStateToProps = (state, props) => state;

/**
 * Connect container component to redux store
 *
 * @param store
 */
export const connect = (
    mapStateToProps,
    mapActionCreators = {}
) => component => ({
    oninit(vnode) {
        this.store = store();
        this.componentState = stream({});
        this.unsubscribe = null;
        this.actions = bindActionCreators(mapActionCreators, this.store.dispatch);

        this.isSubscribed = () => typeof this.unsubscribe === "function";

        this.trySubscribe = () => {
            if (!this.isSubscribed()) {
                this.unsubscribe = this.store.subscribe(
                    this.handleUpdate.bind(this, vnode)
                );

                if (typeof unsubscribeRedraw === "function") {
                    unsubscribeRedraw();
                    unsubscribeRedraw = null;
                }

                unsubscribeRedraw = this.store.subscribe(
                    this.handleRedraw.bind(this)
                );

                this.handleUpdate(vnode);
            }
        };

        this.tryUnsubscribe = () => {
            if (this.isSubscribed()) {
                this.unsubscribe();
                this.unsubscribe = null;
            }
        };

        this.handleUpdate = vnode => {
            if (!this.isSubscribed()) return true;
            const ownProps = vnode.attrs || {};
            const storeState = mapStateToProps(this.store.getState(), ownProps);

            this.componentState(storeState);
        };

        this.handleRedraw = () => {
            setTimeout(m.redraw);
        };

        this.trySubscribe();
    },

    onbeforeremove(vnode) {
        if (typeof component.onbeforeremove === "function")
            return component.onbeforeremove(vnode);
    },

    onremove(vnode) {
        this.actions = null;
        this.store = null;
        this.componentState = null;
        this.tryUnsubscribe();
    },

    view(vnode) {
        const actions = this.actions;
        const storeProps = this.componentState();

        return m(
            component,
            { actions, ...storeProps, ...vnode.attrs },
            vnode.children
        );
    }
});

/**
 * Configure store to use reducers/middleware
 *
 * @param reducers
 * @param initialState
 * @param middleware
 * @returns {Store<S>}
 */
export const createStore = (reducers, initialState = {}, middleware = []) => {
    store(
        createReduxStore(
            combineReducers(reducers),
            initialState,
            applyMiddleware(...middleware)
        )
    );

    return store();
};
