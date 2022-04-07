import {all, fork} from "@redux-saga/core/effects";
// import {questionnaireWatcher} from "_/sagas/questionnaire";


export function* rootSaga() {
    yield all([
        // fork(questionnaireWatcher),

    ]);
}
