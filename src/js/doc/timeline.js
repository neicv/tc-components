import m from 'mithril';

import Timeline from '../components/Timeline';
import TimelineItem from '../components/Timeline/components/TimelineItem'
import TimelineOppositeContent from '../components/Timeline/components/TimelineOppositeContent'

class TimeLineDoc {
    onitit() {
    }

    view() {
        return (
            <div className="test">
                <Timeline position='left'>
                    <TimelineItem>
                        <TimelineOppositeContent color="text.secondary">
                            09:30 am
                        </TimelineOppositeContent>
                        Item 1
                    </TimelineItem>
                    <TimelineItem>
                        Item 2
                    </TimelineItem>
                    <TimelineItem>
                        Item 3
                    </TimelineItem>
                </Timeline>
            </div>
        )
    }
}
export default TimeLineDoc;
