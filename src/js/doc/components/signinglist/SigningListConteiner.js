import m from 'mithril';

import Component from '@/lib/Component';
import Timeline from '@/components/Timeline';
import TimelineItem from '@/components/Timeline/components/TimelineItem';
import TimelineOppositeContent from '@/components/Timeline/components/TimelineOppositeContent';
import TimelineSeparator from '@/components/Timeline/components/TimelineSeparator';
import TimelineDot from '@/components/Timeline/components/TimelineDot';
import TimelineConnector from '@/components/Timeline/components/TimelineConnector';
import TimelineContent from '@/components/Timeline/components/TimelineContent';

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

                            const dotColor = this.getColorStepApproved(index, data);

                            return (
                                <TimelineItem>
                                    <TimelineOppositeContent color="text.secondary" className="fs13">
                                        {date}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <Choose>
                                            <When condition={index === 0 && data.lenght !==0}>
                                                <TimelineDot variant="outlined" color="success">
                                                    <span className='font-icon flag-finish success'></span>
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
                            )
                        })
                    }
                </Timeline>
            </div>
        )
    }

    // Передавать data ?
    getColorStepApproved(index, data = []) {
        if (index === 0 || index ===  data.length - 1) {
            return false;
        }
        // Reverse !
        let rIndex      = data.length - 1 - index;
        let signingList = data[rIndex]?.signingList;

        if (!signingList || signingList.length === 0) {
            return false;
        }

        return signingList.map(el => el.agreed).includes(false) ? COLOR_DISAPPROVE : COLOR_APPROVE;
    }
}

export default SigningListContainer;
