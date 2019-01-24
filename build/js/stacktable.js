/**
 * stacktable.js
 * Author & copyright (c) 2012: John Polacek
 * CardTable by: Justin McNally (2015)
 * Dual MIT & GPL license
 *
 * Page: http://johnpolacek.github.com/stacktable.js
 * Repo: https://github.com/johnpolacek/stacktable.js/
 *
 * jQuery plugin for stacking tables on small screens
 * Requires jQuery version 1.7 or above
 *
 */
;(function($) {
  $.fn.cardtable = function(options) {
    var $tables = this,
        defaults = {headIndex:0},
        settings = $.extend({}, defaults, options),
        headIndex;

    // checking the "headIndex" option presence... or defaults it to 0
    if(options && options.headIndex)
      headIndex = options.headIndex;
    else
      headIndex = 0;

    return $tables.each(function() {
      var $table = $(this);
      if ($table.hasClass('stacktable')) {
        return;
      }
      var table_css = $(this).prop('class');
      var $stacktable = $('<div></div>');
      if (typeof settings.myClass !== 'undefined') $stacktable.addClass(settings.myClass);
      var markup = '';
      var $caption, $topRow, headMarkup, bodyMarkup, tr_class;

      $table.addClass('stacktable large-only');

      $caption = $table.find(">caption").clone();
      $topRow = $table.find('>thead>tr,>tbody>tr,>tfoot>tr,>tr').eq(0);

      // avoid duplication when paginating
      $table.siblings().filter('.small-only').remove();

      // using rowIndex and cellIndex in order to reduce ambiguity
      $table.find('>tbody>tr').each(function() {

        // declaring headMarkup and bodyMarkup, to be used for separately head and body of single records
        headMarkup = '';
        bodyMarkup = '';
        tr_class = $(this).prop('class');
        // for the first row, "headIndex" cell is the head of the table
        // for the other rows, put the "headIndex" cell as the head for that row
        // then iterate through the key/values
        $(this).find('>td,>th').each(function(cellIndex) {
          if ($(this).html() !== ''){
            bodyMarkup += '<tr class="' + tr_class +'">';
            if ($topRow.find('>td,>th').eq(cellIndex).html()){
              bodyMarkup += '<td class="st-key">'+$topRow.find('>td,>th').eq(cellIndex).html()+'</td>';
            } else {
              bodyMarkup += '<td class="st-key"></td>';
            }
            bodyMarkup += '<td class="st-val '+$(this).prop('class')  +'">'+$(this).html()+'</td>';
            bodyMarkup += '</tr>';
          }
        });

        markup += '<table class=" '+ table_css +' stacktable small-only"><tbody>' + headMarkup + bodyMarkup + '</tbody></table>';
      });

      $table.find('>tfoot>tr>td').each(function(rowIndex,value) {
        if ($.trim($(value).text()) !== '') {
          markup += '<table class="'+ table_css + ' stacktable small-only"><tbody><tr><td>' + $(value).html() + '</td></tr></tbody></table>';
        }
      });

      $stacktable.prepend($caption);
      $stacktable.append($(markup));
      $table.before($stacktable);
    });
  };

  $.fn.stacktable = function(options) {
    var $tables = this,
        defaults = {headIndex:0,displayHeader:true},
        settings = $.extend({}, defaults, options),
        headIndex;

    // checking the "headIndex" option presence... or defaults it to 0
    if(options && options.headIndex)
      headIndex = options.headIndex;
    else
      headIndex = 0;

    return $tables.each(function() {
      var table_css = $(this).prop('class');
      var $stacktable = $('<table class="'+ table_css +' stacktable small-only"><tbody></tbody></table>');
      if (typeof settings.myClass !== 'undefined') $stacktable.addClass(settings.myClass);
      var markup = '';
      var $table, $caption, $topRow, headMarkup, bodyMarkup, tr_class, displayHeader;

      $table = $(this);
      $table.addClass('stacktable large-only');
      $caption = $table.find(">caption").clone();
      $topRow = $table.find('>thead>tr,>tbody>tr,>tfoot>tr').eq(0);

      displayHeader = $table.data('display-header') === undefined ? settings.displayHeader : $table.data('display-header');

      // using rowIndex and cellIndex in order to reduce ambiguity
      $table.find('>tbody>tr, >thead>tr').each(function(rowIndex) {

        // declaring headMarkup and bodyMarkup, to be used for separately head and body of single records
        headMarkup = '';
        bodyMarkup = '';
        tr_class = $(this).prop('class');

        // for the first row, "headIndex" cell is the head of the table
        if (rowIndex === 0) {
          // the main heading goes into the markup variable
          if (displayHeader) {
            markup += '<tr class=" '+tr_class +' "><th class="st-head-row st-head-row-main" colspan="2">'+$(this).find('>th,>td').eq(headIndex).html()+'</th></tr>';
          }
        } else {
          // for the other rows, put the "headIndex" cell as the head for that row
          // then iterate through the key/values
          $(this).find('>td,>th').each(function(cellIndex) {
            if (cellIndex === headIndex) {
              headMarkup = '<tr class="'+ tr_class+'"><th class="st-head-row" colspan="2">'+$(this).html()+'</th></tr>';
            } else {
              if ($(this).html() !== ''){
                bodyMarkup += '<tr class="' + tr_class +'">';
                if ($topRow.find('>td,>th').eq(cellIndex).html()){
                  bodyMarkup += '<td class="st-key">'+$topRow.find('>td,>th').eq(cellIndex).html()+'</td>';
                } else {
                  bodyMarkup += '<td class="st-key"></td>';
                }
                bodyMarkup += '<td class="st-val '+$(this).prop('class')  +'">'+$(this).html()+'</td>';
                bodyMarkup += '</tr>';
              }
            }
          });

          markup += headMarkup + bodyMarkup;
        }
      });

      $stacktable.prepend($caption);
      $stacktable.append($(markup));
      $table.before($stacktable);
    });
  };

 $.fn.stackcolumns = function(options) {
    var $tables = this,
        defaults = {},
        settings = $.extend({}, defaults, options);

    return $tables.each(function() {
      var $table = $(this);
      var $caption = $table.find(">caption").clone();
      var num_cols = $table.find('>thead>tr,>tbody>tr,>tfoot>tr').eq(0).find('>td,>th').length; //first table <tr> must not contain colspans, or add sum(colspan-1) here.
      if(num_cols<3) //stackcolumns has no effect on tables with less than 3 columns
        return;

      var $stackcolumns = $('<table class="stacktable small-only"></table>');
      if (typeof settings.myClass !== 'undefined') $stackcolumns.addClass(settings.myClass);
      $table.addClass('stacktable large-only');
      var tb = $('<tbody></tbody>');
      var col_i = 1; //col index starts at 0 -> start copy at second column.

      while (col_i < num_cols) {
        $table.find('>thead>tr,>tbody>tr,>tfoot>tr').each(function(index) {
          var tem = $('<tr></tr>'); // todo opt. copy styles of $this; todo check if parent is thead or tfoot to handle accordingly
          if(index === 0) tem.addClass("st-head-row st-head-row-main");
          var first = $(this).find('>td,>th').eq(0).clone().addClass("st-key");
          var target = col_i;
          // if colspan apply, recompute target for second cell.
          if ($(this).find("*[colspan]").length) {
            var i =0;
            $(this).find('>td,>th').each(function() {
                var cs = $(this).attr("colspan");
                if (cs) {
                  cs = parseInt(cs, 10);
                  target -= cs-1;
                  if ((i+cs) > (col_i)) //out of current bounds
                    target += i + cs - col_i -1;
                  i += cs;
                } else {
                  i++;
                }

                if (i > col_i)
                  return false; //target is set; break.
            });
          }
          var second = $(this).find('>td,>th').eq(target).clone().addClass("st-val").removeAttr("colspan");
          tem.append(first, second);
          tb.append(tem);
        });
        ++col_i;
      }

      $stackcolumns.append($(tb));
      $stackcolumns.prepend($caption);
      $table.before($stackcolumns);
    });
  };

}(jQuery));


jQuery(document).ready(function($) {
	jQuery(function($){
		$('.teblrespons').stacktable();
	});
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzdGFja3RhYmxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogc3RhY2t0YWJsZS5qc1xuICogQXV0aG9yICYgY29weXJpZ2h0IChjKSAyMDEyOiBKb2huIFBvbGFjZWtcbiAqIENhcmRUYWJsZSBieTogSnVzdGluIE1jTmFsbHkgKDIwMTUpXG4gKiBEdWFsIE1JVCAmIEdQTCBsaWNlbnNlXG4gKlxuICogUGFnZTogaHR0cDovL2pvaG5wb2xhY2VrLmdpdGh1Yi5jb20vc3RhY2t0YWJsZS5qc1xuICogUmVwbzogaHR0cHM6Ly9naXRodWIuY29tL2pvaG5wb2xhY2VrL3N0YWNrdGFibGUuanMvXG4gKlxuICogalF1ZXJ5IHBsdWdpbiBmb3Igc3RhY2tpbmcgdGFibGVzIG9uIHNtYWxsIHNjcmVlbnNcbiAqIFJlcXVpcmVzIGpRdWVyeSB2ZXJzaW9uIDEuNyBvciBhYm92ZVxuICpcbiAqL1xuOyhmdW5jdGlvbigkKSB7XG4gICQuZm4uY2FyZHRhYmxlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciAkdGFibGVzID0gdGhpcyxcbiAgICAgICAgZGVmYXVsdHMgPSB7aGVhZEluZGV4OjB9LFxuICAgICAgICBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyksXG4gICAgICAgIGhlYWRJbmRleDtcblxuICAgIC8vIGNoZWNraW5nIHRoZSBcImhlYWRJbmRleFwiIG9wdGlvbiBwcmVzZW5jZS4uLiBvciBkZWZhdWx0cyBpdCB0byAwXG4gICAgaWYob3B0aW9ucyAmJiBvcHRpb25zLmhlYWRJbmRleClcbiAgICAgIGhlYWRJbmRleCA9IG9wdGlvbnMuaGVhZEluZGV4O1xuICAgIGVsc2VcbiAgICAgIGhlYWRJbmRleCA9IDA7XG5cbiAgICByZXR1cm4gJHRhYmxlcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICR0YWJsZSA9ICQodGhpcyk7XG4gICAgICBpZiAoJHRhYmxlLmhhc0NsYXNzKCdzdGFja3RhYmxlJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHRhYmxlX2NzcyA9ICQodGhpcykucHJvcCgnY2xhc3MnKTtcbiAgICAgIHZhciAkc3RhY2t0YWJsZSA9ICQoJzxkaXY+PC9kaXY+Jyk7XG4gICAgICBpZiAodHlwZW9mIHNldHRpbmdzLm15Q2xhc3MgIT09ICd1bmRlZmluZWQnKSAkc3RhY2t0YWJsZS5hZGRDbGFzcyhzZXR0aW5ncy5teUNsYXNzKTtcbiAgICAgIHZhciBtYXJrdXAgPSAnJztcbiAgICAgIHZhciAkY2FwdGlvbiwgJHRvcFJvdywgaGVhZE1hcmt1cCwgYm9keU1hcmt1cCwgdHJfY2xhc3M7XG5cbiAgICAgICR0YWJsZS5hZGRDbGFzcygnc3RhY2t0YWJsZSBsYXJnZS1vbmx5Jyk7XG5cbiAgICAgICRjYXB0aW9uID0gJHRhYmxlLmZpbmQoXCI+Y2FwdGlvblwiKS5jbG9uZSgpO1xuICAgICAgJHRvcFJvdyA9ICR0YWJsZS5maW5kKCc+dGhlYWQ+dHIsPnRib2R5PnRyLD50Zm9vdD50ciw+dHInKS5lcSgwKTtcblxuICAgICAgLy8gYXZvaWQgZHVwbGljYXRpb24gd2hlbiBwYWdpbmF0aW5nXG4gICAgICAkdGFibGUuc2libGluZ3MoKS5maWx0ZXIoJy5zbWFsbC1vbmx5JykucmVtb3ZlKCk7XG5cbiAgICAgIC8vIHVzaW5nIHJvd0luZGV4IGFuZCBjZWxsSW5kZXggaW4gb3JkZXIgdG8gcmVkdWNlIGFtYmlndWl0eVxuICAgICAgJHRhYmxlLmZpbmQoJz50Ym9keT50cicpLmVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gZGVjbGFyaW5nIGhlYWRNYXJrdXAgYW5kIGJvZHlNYXJrdXAsIHRvIGJlIHVzZWQgZm9yIHNlcGFyYXRlbHkgaGVhZCBhbmQgYm9keSBvZiBzaW5nbGUgcmVjb3Jkc1xuICAgICAgICBoZWFkTWFya3VwID0gJyc7XG4gICAgICAgIGJvZHlNYXJrdXAgPSAnJztcbiAgICAgICAgdHJfY2xhc3MgPSAkKHRoaXMpLnByb3AoJ2NsYXNzJyk7XG4gICAgICAgIC8vIGZvciB0aGUgZmlyc3Qgcm93LCBcImhlYWRJbmRleFwiIGNlbGwgaXMgdGhlIGhlYWQgb2YgdGhlIHRhYmxlXG4gICAgICAgIC8vIGZvciB0aGUgb3RoZXIgcm93cywgcHV0IHRoZSBcImhlYWRJbmRleFwiIGNlbGwgYXMgdGhlIGhlYWQgZm9yIHRoYXQgcm93XG4gICAgICAgIC8vIHRoZW4gaXRlcmF0ZSB0aHJvdWdoIHRoZSBrZXkvdmFsdWVzXG4gICAgICAgICQodGhpcykuZmluZCgnPnRkLD50aCcpLmVhY2goZnVuY3Rpb24oY2VsbEluZGV4KSB7XG4gICAgICAgICAgaWYgKCQodGhpcykuaHRtbCgpICE9PSAnJyl7XG4gICAgICAgICAgICBib2R5TWFya3VwICs9ICc8dHIgY2xhc3M9XCInICsgdHJfY2xhc3MgKydcIj4nO1xuICAgICAgICAgICAgaWYgKCR0b3BSb3cuZmluZCgnPnRkLD50aCcpLmVxKGNlbGxJbmRleCkuaHRtbCgpKXtcbiAgICAgICAgICAgICAgYm9keU1hcmt1cCArPSAnPHRkIGNsYXNzPVwic3Qta2V5XCI+JyskdG9wUm93LmZpbmQoJz50ZCw+dGgnKS5lcShjZWxsSW5kZXgpLmh0bWwoKSsnPC90ZD4nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYm9keU1hcmt1cCArPSAnPHRkIGNsYXNzPVwic3Qta2V5XCI+PC90ZD4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYm9keU1hcmt1cCArPSAnPHRkIGNsYXNzPVwic3QtdmFsICcrJCh0aGlzKS5wcm9wKCdjbGFzcycpICArJ1wiPicrJCh0aGlzKS5odG1sKCkrJzwvdGQ+JztcbiAgICAgICAgICAgIGJvZHlNYXJrdXAgKz0gJzwvdHI+JztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1hcmt1cCArPSAnPHRhYmxlIGNsYXNzPVwiICcrIHRhYmxlX2NzcyArJyBzdGFja3RhYmxlIHNtYWxsLW9ubHlcIj48dGJvZHk+JyArIGhlYWRNYXJrdXAgKyBib2R5TWFya3VwICsgJzwvdGJvZHk+PC90YWJsZT4nO1xuICAgICAgfSk7XG5cbiAgICAgICR0YWJsZS5maW5kKCc+dGZvb3Q+dHI+dGQnKS5lYWNoKGZ1bmN0aW9uKHJvd0luZGV4LHZhbHVlKSB7XG4gICAgICAgIGlmICgkLnRyaW0oJCh2YWx1ZSkudGV4dCgpKSAhPT0gJycpIHtcbiAgICAgICAgICBtYXJrdXAgKz0gJzx0YWJsZSBjbGFzcz1cIicrIHRhYmxlX2NzcyArICcgc3RhY2t0YWJsZSBzbWFsbC1vbmx5XCI+PHRib2R5Pjx0cj48dGQ+JyArICQodmFsdWUpLmh0bWwoKSArICc8L3RkPjwvdHI+PC90Ym9keT48L3RhYmxlPic7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAkc3RhY2t0YWJsZS5wcmVwZW5kKCRjYXB0aW9uKTtcbiAgICAgICRzdGFja3RhYmxlLmFwcGVuZCgkKG1hcmt1cCkpO1xuICAgICAgJHRhYmxlLmJlZm9yZSgkc3RhY2t0YWJsZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgJC5mbi5zdGFja3RhYmxlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciAkdGFibGVzID0gdGhpcyxcbiAgICAgICAgZGVmYXVsdHMgPSB7aGVhZEluZGV4OjAsZGlzcGxheUhlYWRlcjp0cnVlfSxcbiAgICAgICAgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpLFxuICAgICAgICBoZWFkSW5kZXg7XG5cbiAgICAvLyBjaGVja2luZyB0aGUgXCJoZWFkSW5kZXhcIiBvcHRpb24gcHJlc2VuY2UuLi4gb3IgZGVmYXVsdHMgaXQgdG8gMFxuICAgIGlmKG9wdGlvbnMgJiYgb3B0aW9ucy5oZWFkSW5kZXgpXG4gICAgICBoZWFkSW5kZXggPSBvcHRpb25zLmhlYWRJbmRleDtcbiAgICBlbHNlXG4gICAgICBoZWFkSW5kZXggPSAwO1xuXG4gICAgcmV0dXJuICR0YWJsZXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0YWJsZV9jc3MgPSAkKHRoaXMpLnByb3AoJ2NsYXNzJyk7XG4gICAgICB2YXIgJHN0YWNrdGFibGUgPSAkKCc8dGFibGUgY2xhc3M9XCInKyB0YWJsZV9jc3MgKycgc3RhY2t0YWJsZSBzbWFsbC1vbmx5XCI+PHRib2R5PjwvdGJvZHk+PC90YWJsZT4nKTtcbiAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MubXlDbGFzcyAhPT0gJ3VuZGVmaW5lZCcpICRzdGFja3RhYmxlLmFkZENsYXNzKHNldHRpbmdzLm15Q2xhc3MpO1xuICAgICAgdmFyIG1hcmt1cCA9ICcnO1xuICAgICAgdmFyICR0YWJsZSwgJGNhcHRpb24sICR0b3BSb3csIGhlYWRNYXJrdXAsIGJvZHlNYXJrdXAsIHRyX2NsYXNzLCBkaXNwbGF5SGVhZGVyO1xuXG4gICAgICAkdGFibGUgPSAkKHRoaXMpO1xuICAgICAgJHRhYmxlLmFkZENsYXNzKCdzdGFja3RhYmxlIGxhcmdlLW9ubHknKTtcbiAgICAgICRjYXB0aW9uID0gJHRhYmxlLmZpbmQoXCI+Y2FwdGlvblwiKS5jbG9uZSgpO1xuICAgICAgJHRvcFJvdyA9ICR0YWJsZS5maW5kKCc+dGhlYWQ+dHIsPnRib2R5PnRyLD50Zm9vdD50cicpLmVxKDApO1xuXG4gICAgICBkaXNwbGF5SGVhZGVyID0gJHRhYmxlLmRhdGEoJ2Rpc3BsYXktaGVhZGVyJykgPT09IHVuZGVmaW5lZCA/IHNldHRpbmdzLmRpc3BsYXlIZWFkZXIgOiAkdGFibGUuZGF0YSgnZGlzcGxheS1oZWFkZXInKTtcblxuICAgICAgLy8gdXNpbmcgcm93SW5kZXggYW5kIGNlbGxJbmRleCBpbiBvcmRlciB0byByZWR1Y2UgYW1iaWd1aXR5XG4gICAgICAkdGFibGUuZmluZCgnPnRib2R5PnRyLCA+dGhlYWQ+dHInKS5lYWNoKGZ1bmN0aW9uKHJvd0luZGV4KSB7XG5cbiAgICAgICAgLy8gZGVjbGFyaW5nIGhlYWRNYXJrdXAgYW5kIGJvZHlNYXJrdXAsIHRvIGJlIHVzZWQgZm9yIHNlcGFyYXRlbHkgaGVhZCBhbmQgYm9keSBvZiBzaW5nbGUgcmVjb3Jkc1xuICAgICAgICBoZWFkTWFya3VwID0gJyc7XG4gICAgICAgIGJvZHlNYXJrdXAgPSAnJztcbiAgICAgICAgdHJfY2xhc3MgPSAkKHRoaXMpLnByb3AoJ2NsYXNzJyk7XG5cbiAgICAgICAgLy8gZm9yIHRoZSBmaXJzdCByb3csIFwiaGVhZEluZGV4XCIgY2VsbCBpcyB0aGUgaGVhZCBvZiB0aGUgdGFibGVcbiAgICAgICAgaWYgKHJvd0luZGV4ID09PSAwKSB7XG4gICAgICAgICAgLy8gdGhlIG1haW4gaGVhZGluZyBnb2VzIGludG8gdGhlIG1hcmt1cCB2YXJpYWJsZVxuICAgICAgICAgIGlmIChkaXNwbGF5SGVhZGVyKSB7XG4gICAgICAgICAgICBtYXJrdXAgKz0gJzx0ciBjbGFzcz1cIiAnK3RyX2NsYXNzICsnIFwiPjx0aCBjbGFzcz1cInN0LWhlYWQtcm93IHN0LWhlYWQtcm93LW1haW5cIiBjb2xzcGFuPVwiMlwiPicrJCh0aGlzKS5maW5kKCc+dGgsPnRkJykuZXEoaGVhZEluZGV4KS5odG1sKCkrJzwvdGg+PC90cj4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmb3IgdGhlIG90aGVyIHJvd3MsIHB1dCB0aGUgXCJoZWFkSW5kZXhcIiBjZWxsIGFzIHRoZSBoZWFkIGZvciB0aGF0IHJvd1xuICAgICAgICAgIC8vIHRoZW4gaXRlcmF0ZSB0aHJvdWdoIHRoZSBrZXkvdmFsdWVzXG4gICAgICAgICAgJCh0aGlzKS5maW5kKCc+dGQsPnRoJykuZWFjaChmdW5jdGlvbihjZWxsSW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChjZWxsSW5kZXggPT09IGhlYWRJbmRleCkge1xuICAgICAgICAgICAgICBoZWFkTWFya3VwID0gJzx0ciBjbGFzcz1cIicrIHRyX2NsYXNzKydcIj48dGggY2xhc3M9XCJzdC1oZWFkLXJvd1wiIGNvbHNwYW49XCIyXCI+JyskKHRoaXMpLmh0bWwoKSsnPC90aD48L3RyPic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5odG1sKCkgIT09ICcnKXtcbiAgICAgICAgICAgICAgICBib2R5TWFya3VwICs9ICc8dHIgY2xhc3M9XCInICsgdHJfY2xhc3MgKydcIj4nO1xuICAgICAgICAgICAgICAgIGlmICgkdG9wUm93LmZpbmQoJz50ZCw+dGgnKS5lcShjZWxsSW5kZXgpLmh0bWwoKSl7XG4gICAgICAgICAgICAgICAgICBib2R5TWFya3VwICs9ICc8dGQgY2xhc3M9XCJzdC1rZXlcIj4nKyR0b3BSb3cuZmluZCgnPnRkLD50aCcpLmVxKGNlbGxJbmRleCkuaHRtbCgpKyc8L3RkPic7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGJvZHlNYXJrdXAgKz0gJzx0ZCBjbGFzcz1cInN0LWtleVwiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYm9keU1hcmt1cCArPSAnPHRkIGNsYXNzPVwic3QtdmFsICcrJCh0aGlzKS5wcm9wKCdjbGFzcycpICArJ1wiPicrJCh0aGlzKS5odG1sKCkrJzwvdGQ+JztcbiAgICAgICAgICAgICAgICBib2R5TWFya3VwICs9ICc8L3RyPic7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG1hcmt1cCArPSBoZWFkTWFya3VwICsgYm9keU1hcmt1cDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgICRzdGFja3RhYmxlLnByZXBlbmQoJGNhcHRpb24pO1xuICAgICAgJHN0YWNrdGFibGUuYXBwZW5kKCQobWFya3VwKSk7XG4gICAgICAkdGFibGUuYmVmb3JlKCRzdGFja3RhYmxlKTtcbiAgICB9KTtcbiAgfTtcblxuICQuZm4uc3RhY2tjb2x1bW5zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciAkdGFibGVzID0gdGhpcyxcbiAgICAgICAgZGVmYXVsdHMgPSB7fSxcbiAgICAgICAgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuICR0YWJsZXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkdGFibGUgPSAkKHRoaXMpO1xuICAgICAgdmFyICRjYXB0aW9uID0gJHRhYmxlLmZpbmQoXCI+Y2FwdGlvblwiKS5jbG9uZSgpO1xuICAgICAgdmFyIG51bV9jb2xzID0gJHRhYmxlLmZpbmQoJz50aGVhZD50ciw+dGJvZHk+dHIsPnRmb290PnRyJykuZXEoMCkuZmluZCgnPnRkLD50aCcpLmxlbmd0aDsgLy9maXJzdCB0YWJsZSA8dHI+IG11c3Qgbm90IGNvbnRhaW4gY29sc3BhbnMsIG9yIGFkZCBzdW0oY29sc3Bhbi0xKSBoZXJlLlxuICAgICAgaWYobnVtX2NvbHM8MykgLy9zdGFja2NvbHVtbnMgaGFzIG5vIGVmZmVjdCBvbiB0YWJsZXMgd2l0aCBsZXNzIHRoYW4gMyBjb2x1bW5zXG4gICAgICAgIHJldHVybjtcblxuICAgICAgdmFyICRzdGFja2NvbHVtbnMgPSAkKCc8dGFibGUgY2xhc3M9XCJzdGFja3RhYmxlIHNtYWxsLW9ubHlcIj48L3RhYmxlPicpO1xuICAgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5teUNsYXNzICE9PSAndW5kZWZpbmVkJykgJHN0YWNrY29sdW1ucy5hZGRDbGFzcyhzZXR0aW5ncy5teUNsYXNzKTtcbiAgICAgICR0YWJsZS5hZGRDbGFzcygnc3RhY2t0YWJsZSBsYXJnZS1vbmx5Jyk7XG4gICAgICB2YXIgdGIgPSAkKCc8dGJvZHk+PC90Ym9keT4nKTtcbiAgICAgIHZhciBjb2xfaSA9IDE7IC8vY29sIGluZGV4IHN0YXJ0cyBhdCAwIC0+IHN0YXJ0IGNvcHkgYXQgc2Vjb25kIGNvbHVtbi5cblxuICAgICAgd2hpbGUgKGNvbF9pIDwgbnVtX2NvbHMpIHtcbiAgICAgICAgJHRhYmxlLmZpbmQoJz50aGVhZD50ciw+dGJvZHk+dHIsPnRmb290PnRyJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgIHZhciB0ZW0gPSAkKCc8dHI+PC90cj4nKTsgLy8gdG9kbyBvcHQuIGNvcHkgc3R5bGVzIG9mICR0aGlzOyB0b2RvIGNoZWNrIGlmIHBhcmVudCBpcyB0aGVhZCBvciB0Zm9vdCB0byBoYW5kbGUgYWNjb3JkaW5nbHlcbiAgICAgICAgICBpZihpbmRleCA9PT0gMCkgdGVtLmFkZENsYXNzKFwic3QtaGVhZC1yb3cgc3QtaGVhZC1yb3ctbWFpblwiKTtcbiAgICAgICAgICB2YXIgZmlyc3QgPSAkKHRoaXMpLmZpbmQoJz50ZCw+dGgnKS5lcSgwKS5jbG9uZSgpLmFkZENsYXNzKFwic3Qta2V5XCIpO1xuICAgICAgICAgIHZhciB0YXJnZXQgPSBjb2xfaTtcbiAgICAgICAgICAvLyBpZiBjb2xzcGFuIGFwcGx5LCByZWNvbXB1dGUgdGFyZ2V0IGZvciBzZWNvbmQgY2VsbC5cbiAgICAgICAgICBpZiAoJCh0aGlzKS5maW5kKFwiKltjb2xzcGFuXVwiKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBpID0wO1xuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCc+dGQsPnRoJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3MgPSAkKHRoaXMpLmF0dHIoXCJjb2xzcGFuXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjcykge1xuICAgICAgICAgICAgICAgICAgY3MgPSBwYXJzZUludChjcywgMTApO1xuICAgICAgICAgICAgICAgICAgdGFyZ2V0IC09IGNzLTE7XG4gICAgICAgICAgICAgICAgICBpZiAoKGkrY3MpID4gKGNvbF9pKSkgLy9vdXQgb2YgY3VycmVudCBib3VuZHNcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ICs9IGkgKyBjcyAtIGNvbF9pIC0xO1xuICAgICAgICAgICAgICAgICAgaSArPSBjcztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpID4gY29sX2kpXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vdGFyZ2V0IGlzIHNldDsgYnJlYWsuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHNlY29uZCA9ICQodGhpcykuZmluZCgnPnRkLD50aCcpLmVxKHRhcmdldCkuY2xvbmUoKS5hZGRDbGFzcyhcInN0LXZhbFwiKS5yZW1vdmVBdHRyKFwiY29sc3BhblwiKTtcbiAgICAgICAgICB0ZW0uYXBwZW5kKGZpcnN0LCBzZWNvbmQpO1xuICAgICAgICAgIHRiLmFwcGVuZCh0ZW0pO1xuICAgICAgICB9KTtcbiAgICAgICAgKytjb2xfaTtcbiAgICAgIH1cblxuICAgICAgJHN0YWNrY29sdW1ucy5hcHBlbmQoJCh0YikpO1xuICAgICAgJHN0YWNrY29sdW1ucy5wcmVwZW5kKCRjYXB0aW9uKTtcbiAgICAgICR0YWJsZS5iZWZvcmUoJHN0YWNrY29sdW1ucyk7XG4gICAgfSk7XG4gIH07XG5cbn0oalF1ZXJ5KSk7XG5cblxualF1ZXJ5KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigkKSB7XG5cdGpRdWVyeShmdW5jdGlvbigkKXtcblx0XHQkKCcudGVibHJlc3BvbnMnKS5zdGFja3RhYmxlKCk7XG5cdH0pO1xufSk7Il0sImZpbGUiOiJzdGFja3RhYmxlLmpzIn0=
