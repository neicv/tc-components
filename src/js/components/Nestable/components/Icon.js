import m from "mithril";
import cx from 'classnames';
import Component from "@/lib/Component";

class Icon extends Component {
  view() {
    // eslint-disable-next-line no-unused-vars
    const { children, className, ...props } = this.attrs;

    return (
      <i className={cx('nestable-icon', className)} {...props} />
    );
  }
}

export default Icon;
