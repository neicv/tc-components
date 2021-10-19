import m from 'mithril';

import Component from '@/lib/Component';
import Timeline from '@/components/Timeline';
import TimelineItem from '@/components/Timeline/components/TimelineItem';
import TimelineOppositeContent from '@/components/Timeline/components/TimelineOppositeContent';
import TimelineSeparator from '@/components/Timeline/components/TimelineSeparator';
import TimelineDot from '@/components/Timeline/components/TimelineDot';
import TimelineConnector from '@/components/Timeline/components/TimelineConnector';
import TimelineContent from '@/components/Timeline/components/TimelineContent';
import SignatureSheet from './SignatureSheet';

import StatusInfo from './StatusInfo';

const COLOR_APPROVE    = 'success';
const COLOR_DISAPPROVE = 'error';

class SigningListContainer extends Component {

    view() {
        const { data, viewDetailsInfo, itemTitleClass } = this.attrs;

        return (
            <div className="sign-list-container">
                <Timeline position="both">
                    {
                        data.slice(0).reverse().map((item, index) => {
                            let { date, ...other } = item;
                            other = {...other, viewDetailsInfo, itemTitleClass}

                            const signingList      = this.getSigningList(index, data);
                            const dotColorTmp      = this.getColorStepApprovedFromStatus(index, data)
                            let dotColor           = dotColorTmp || this.getColorStepApproved(signingList);
                            const shortSigningList = this.getShortSigningList(signingList);

                            return (
                                <>
                                    {/* Status Item */}
                                    <TimelineItem>
                                        <TimelineOppositeContent color="text.secondary" className="fs13">
                                            {date}
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <Choose>
                                                <When condition={index === 0 && data.lenght !==0}>
                                                    <TimelineDot variant="outlined" color={dotColor}>
                                                        <span className='font-icon flag-finish color-success'></span>
                                                    </TimelineDot>
                                                </When>
                                                <When  condition={index === (data.length - 1) && data.length > 1}>
                                                    <TimelineDot variant="outlined" color="primary">
                                                        <span className='font-icon flag-start color-primary'></span>
                                                    </TimelineDot>
                                                </When>
                                                <Otherwise>
                                                    <Choose>
                                                        <When condition={dotColor === false}>
                                                            <TimelineDot />
                                                        </When>
                                                        <Otherwise>
                                                            <TimelineDot color={dotColor}/>
                                                        </Otherwise>
                                                    </Choose>
                                                </Otherwise>
                                            </Choose>
                                            <If condition={index !== data.length - 1}>
                                                <TimelineConnector />
                                            </If>
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <StatusInfo {...other} index={index} key={index} />
                                        </TimelineContent>
                                    </TimelineItem>
                                    <Choose>
                                        <When condition={signingList && signingList.length !== 0}>
                                            {/* SigningList */}
                                            <TimelineItem>
                                                <TimelineOppositeContent color="text.secondary" className="fs13">
                                                    {shortSigningList.date}
                                                </TimelineOppositeContent>
                                                <TimelineSeparator>
                                                    <Choose>
                                                        <When condition={shortSigningList.agreed === true}>
                                                            <TimelineDot variant="outlined" color={dotColor}>
                                                                {/* <span className='font-icon icon-tick color-success'></span> */}
                                                            </TimelineDot>
                                                        </When>
                                                        <When  condition={shortSigningList.agreed === false}>
                                                            <TimelineDot variant="outlined" color="error">
                                                                {/* <span className='font-icon cancel color-error'></span> */}
                                                            </TimelineDot>
                                                        </When>
                                                        <Otherwise>
                                                            <TimelineDot />
                                                        </Otherwise>
                                                    </Choose>
                                                    <If condition={index !== data.length - 1}>
                                                        <TimelineConnector />
                                                    </If>
                                                </TimelineSeparator>
                                                    <TimelineContent>
                                                        <SignatureSheet
                                                            index={index}
                                                            signingList={signingList}
                                                            shortSigningList={shortSigningList}
                                                            viewDetailsInfo={viewDetailsInfo}
                                                        />
                                                    </TimelineContent>
                                            </TimelineItem>
                                        </When>
                                    </Choose>
                                </>
                            )
                        })
                    }
                </Timeline>
            </div>
        )
    }

    // Временныый костыль...
    getColorStepApprovedFromStatus(index, data = []) {
        let typeStatus,
            result;
        if (index ===  data.length - 1) {
            return false;
        }
        // Reverse !
        let rIndex      = data.length - 1 - index;
        let list = data[rIndex];

        if (!list || list.length === 0) {
            return false;
        }

        if (list.hasOwnProperty('typeStatus')) {
            typeStatus = list.typeStatus;

            if (typeStatus === undefined) {
                return false;
            }

            result = typeStatus ? COLOR_APPROVE : COLOR_DISAPPROVE;

            return result;
        }

        return false;
    }

    getColorStepApproved(list) {
        // let typeStatus;

        if (list === false) {
            return false;
        }

        // if (list.hasOwnProperty('typeStatus')) {
        //     typeStatus = list.typeStatus;

        //     if (typeStatus === undefined) {
        //         return false;
        //     }

        //     return typeStatus ? COLOR_APPROVE : COLOR_DISAPPROVE;
        // }

        return list.map(el => el.agreed).includes(false) ? COLOR_DISAPPROVE : COLOR_APPROVE;
    }

    // Передавать data ?
    getSigningList(index, data = []) {
        if (index ===  data.length - 1) {
            return false;
        }
        // Reverse ! and See to prev element SigningList
        let rIndex      = data.length - 2 - index;
        let signingList = data[rIndex]?.signingList;

        if (!signingList || signingList.length === 0) {
            return false;
        }

        return signingList;
    }

    getShortSigningList(list) {
        let disapproveList,
            len,
            shortList = {
                comments: "",
                agreed: false,
                agreeStatus: "",
                fio: "",
                date: ""
            }

        if (!list || list.length === 0) {
            return shortList;
        }

        disapproveList = list.filter(el => el.agreed === false);

        len = disapproveList.length;

        if (len !==0) {
            // Последний коммент из не согласованных
            shortList.agreed      = false;
            shortList.comments    = disapproveList[len - 1].comments || '';
            shortList.agreeStatus = disapproveList[len - 1].agreeStatus || TEXT_STATUS_AGREED;
            shortList.fio         = disapproveList[len - 1].fio || '';
            shortList.date        = disapproveList[len - 1].date || '';
        } else {
            shortList.agreed      = true;
            shortList.comments    = list[list.length - 1].comments || '';
            shortList.agreeStatus = list[list.length - 1].agreeStatus || TEXT_STATUS_DISAGREED;
            shortList.date        = list[list.length - 1].date || '';
        }

        return shortList;
    }
}

export default SigningListContainer;
