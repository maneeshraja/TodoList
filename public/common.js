function appendZero(n) {
  return n>=10?n:"0"+n;
}

Date.prototype.getTODOToday = function() {
                                const d = new Date();
                                return d.getFullYear()+"-"+appendZero(d.getMonth()+1)+"-"+appendZero(d.getDate())+" "+appendZero(d.getHours())+":"+appendZero(d.getMinutes())+":"+appendZero(d.getSeconds());
                              };
