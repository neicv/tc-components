import m from 'mithril';

import Timeline from '../components/Timeline';
import TimelineItem from '../components/Timeline/components/TimelineItem';
import TimelineOppositeContent from '../components/Timeline/components/TimelineOppositeContent';
import TimelineSeparator from '../components/Timeline/components/TimelineSeparator';
import TimelineDot from '../components/Timeline/components/TimelineDot';
import TimelineConnector from '../components/Timeline/components/TimelineConnector';
import TimelineContent from '../components/Timeline/components/TimelineContent';

class TimeLineDoc {
    onitit() {
    }

    view() {
        return (
            <div className="test-timeline">
                <p><b> ALTERNATE </b> </p>

                <Timeline position="alternate">
                    <TimelineItem>
                    <TimelineOppositeContent color="secondary">
                        09:30 am
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>Eat</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                    <TimelineOppositeContent color="text.secondary">
                        10:00 am
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>Code</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                    <TimelineOppositeContent color="text.secondary">
                        12:00 am
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>Sleep</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                    <TimelineOppositeContent color="text.secondary">
                        9:00 am
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>Repeat</TimelineContent>
                    </TimelineItem>
                </Timeline>

                <p><b>LEFT</b></p>

                <Timeline position="left">
                    <TimelineItem>
                        <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Eat</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                        <TimelineDot variant="outlined" color="primary"/>
                        <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Code</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                        <TimelineDot variant="filled" color="error"/>
                        <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Sleep</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                        <TimelineDot variant="outlined" color="secondary"/>
                        </TimelineSeparator>
                        <TimelineContent>Repeat</TimelineContent>
                    </TimelineItem>
                </Timeline>

                <p><b>COLOR and Not Set Direction</b></p>

                <Timeline>
                    <TimelineItem>
                        <TimelineSeparator>
                        <TimelineDot color="success">
                            <span className='font-icon role-icon'></span>
                        </TimelineDot>
                        <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Going To Start</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                        <TimelineDot color="secondary" />
                        <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Secondary</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                        <TimelineDot color="success" />
                        <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Success</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                        <TimelineDot>
                            <span className='font-icon home'></span>
                        </TimelineDot>
                        </TimelineSeparator>
                        <TimelineContent>Main House</TimelineContent>
                    </TimelineItem>
                </Timeline>

                <p><b> BOTH </b> </p>

                <Timeline position="both">
                    <TimelineItem>
                    <TimelineOppositeContent color="text.secondary">
                        09:30 am
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>Eat</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                    <TimelineOppositeContent color="text.secondary">
                        10:00 am
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>Code</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                    <TimelineOppositeContent color="text.secondary">
                        12:00 am
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>Sleep</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                    <TimelineOppositeContent color="text.secondary">
                        9:00 am
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot>
                            <span className='font-icon home'></span>
                        </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent>Repeat</TimelineContent>
                    </TimelineItem>
                </Timeline>
            </div>
        )
    }
}
export default TimeLineDoc;
