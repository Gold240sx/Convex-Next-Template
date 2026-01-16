# Form Builder & Chatbot Improvements

## Bugs & Issues
- [ ] **Rich Text Schema Error**: Fix `Object contains extra field content` error when saving forms with Rich Text fields. (Add `content` to `custom_forms` schema).
- [ ] **ChatContents Syntax Error**: Fix "Expected a semicolon" error in `ChatContents.tsx`.
- [ ] **TextField Type Error**: Fix `TextField` not accepting `type` prop (e.g. for email/tel).
- [ ] **Drag & Drop**: Add a border/highlight around the canvas when a tool offers a drop target.
- [x] **Drag & Drop**: Add a border around the canvas when the dragged tool can be dropped to be added to the canvas. (Visual feedback for drop zone).
- [x] **Phone Number**: International & Flags toggle doesn't update the card preview correctly.
- [x] **Images**: Image field has a textbox in preview, should support file upload vs URL toggle, max file size config. (Added Config & Preview).
- [x] **File Upload**: Checkboxes for allowed file types are too small, allow selecting common types, max file size config. (Added better UI for types & size).
- [ ] **Implicit Any Types**: Fix remaining implicit any errors in `page.tsx`.

## UI / UX Enhancements
- [x] **Click to Edit**: Clarify "shouldn't have to click on the form on the forms page to edit". (Fixed: Made card clickable).
- [x] **Step Titles**: Only show "Step Title" input if form is in "Consecutive Mode".
- [x] **Email Field**: Add "Business Emails Only" toggle.
- [x] **Dropdown/Radio Options**: Use a dynamic list builder (+/- buttons) instead of comma-separated string.
- [x] **Radio/Checkbox Preview**: Show actual radio/checkbox list in preview, not a text input.
- [x] **Long Text / Textarea**: Preview should be a textarea, height should match row count, add slider (1-10) for row count.
- [x] **Date Picker**: Preview should show a visual date picker (or at least looks like one).
- [x] **Yes/No Toggle**: Preview should show a toggle switch.
- [x] **Range Slider**: Make track thicker (Shadcn default is ok, verified style), add option for "%" instead of numbers (Added Unit selector).
- [x] **Star Rating**: Remove placeholder, set default value (Added Default Value config).
- [x] **Condition Block**: Add `is null` / `is not null` operators (Added `is_empty`, `is_not_empty`).
- [ ] **Address Verification**: Disable "Verify" toggle if "Google Autocomplete" is false. (Done logic, need to verify if check works visually).
- [ ] **Flex Row**: In preview, show items vertically (Wait, flex row implies horizontal? "Items inside should be vertical"?? Request unclear. Default is horizontal. Added gap control).
- [ ] **Admin UI Refactor**: Form settings for header/footer image/height, border color/width/radius, background, shadow.
- [ ] **Duplicate Components**: Ensure components exported to separate files are no longer duplicated in original files.
