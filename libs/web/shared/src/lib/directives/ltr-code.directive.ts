import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

/**
 * Directive to ensure code blocks always display in LTR direction
 * regardless of the document's overall text direction.
 *
 * Usage: Apply to any element containing code that should remain LTR
 * <pre appLtrCode>...</pre>
 * <code appLtrCode>...</code>
 */
@Directive({
  selector: '[appLtrCode]',
  standalone: true,
})
export class LtrCodeDirective implements OnInit {
  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.applyLtrStyles();
  }

  private applyLtrStyles(): void {
    const element = this.el.nativeElement;

    // Force LTR direction
    this.renderer.setStyle(element, 'direction', 'ltr');
    this.renderer.setStyle(element, 'text-align', 'left');

    // Isolate the bidirectional text
    this.renderer.setStyle(element, 'unicode-bidi', 'isolate');

    // Add dir attribute for accessibility
    this.renderer.setAttribute(element, 'dir', 'ltr');
  }
}

/**
 * Directive specifically for code blocks that should maintain LTR
 * while allowing proper text selection and copy behavior.
 */
@Directive({
  selector: 'pre[appCodeBlock], code[appCodeBlock]',
  standalone: true,
})
export class CodeBlockDirective implements OnInit {
  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const element = this.el.nativeElement;

    // Force LTR for code
    this.renderer.setStyle(element, 'direction', 'ltr');
    this.renderer.setStyle(element, 'text-align', 'left');
    this.renderer.setStyle(element, 'unicode-bidi', 'isolate');
    this.renderer.setAttribute(element, 'dir', 'ltr');

    // Ensure monospace font
    this.renderer.setStyle(element, 'font-family', 'var(--font-mono, monospace)');

    // Better code display
    this.renderer.setStyle(element, 'white-space', 'pre');
    this.renderer.setStyle(element, 'overflow-x', 'auto');
    this.renderer.setStyle(element, 'tab-size', '2');
  }
}
