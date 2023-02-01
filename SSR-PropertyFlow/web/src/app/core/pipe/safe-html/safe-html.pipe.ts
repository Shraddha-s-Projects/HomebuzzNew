import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  pure: true
})
export class SafeHtmlPipe  implements PipeTransform {
    
    constructor(private sanitizer:DomSanitizer){}

    transform(html) {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}