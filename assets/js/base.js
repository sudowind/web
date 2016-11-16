/**
 * Created by wind on 2016/11/10.
 */
var TASK_STATUS = {
    1: 'not start',
    2: 'reading',
    3: 'completed'
};

Date.prototype.getFullDate = function() {
    return this.getFullYear() + '-' + this.getMonth() + '-' + this.getDate();
};