
import { 
    Type, 
    AtSign, 
    AlignLeft, 
    Hash, 
    List, 
    CircleDot, 
    CheckSquare, 
    Calendar, 
    CalendarRange, 
    ToggleLeft, 
    SlidersHorizontal, 
    Star, 
    Smile, 
    GitMerge, 
    Folder, 
    Columns, 
    MapPin, 
    Image as ImageIcon, 
    FileUp, 
    Heading, 
    MessageSquare, 
    Minus, 
    ChevronsUpDown, 
    FileText, 
    Palette,
    Phone
} from "lucide-react"

export const getIconForType = (type: string) => {
    switch (type) {
        case "text": return <Type className="w-4 h-4" />
        case "email": return <AtSign className="w-4 h-4" />
        case "textarea": return <AlignLeft className="w-4 h-4" />
        case "number": return <Hash className="w-4 h-4" />
        case "select": return <List className="w-4 h-4" />
        case "phone": return <Phone className="w-4 h-4" />
        case "boolean": return <ToggleLeft className="w-4 h-4" />
        case "date": return <Calendar className="w-4 h-4" />
        case "radio": return <CircleDot className="w-4 h-4" />
        case "checkbox": return <CheckSquare className="w-4 h-4" />
        case "condition_block": return <GitMerge className="w-4 h-4" />
        case "separator": return <Minus className="w-4 h-4" />
        case "title": return <Heading className="w-4 h-4" />
        case "subtitle": return <MessageSquare className="w-4 h-4" />
        case "address": return <MapPin className="w-4 h-4" />
        case "stepper": return <ChevronsUpDown className="w-4 h-4" />
        case "input_group": return <Folder className="w-4 h-4" />
        case "slider": return <SlidersHorizontal className="w-4 h-4" />
        case "image": return <ImageIcon className="w-4 h-4" />
        case "file_upload": return <FileUp className="w-4 h-4" />
        case "flex_row": return <Columns className="w-4 h-4" />
        case "star_rating": return <Star className="w-4 h-4" />
        case "happiness_rating": return <Smile className="w-4 h-4" />
        case "date_range": return <CalendarRange className="w-4 h-4" />
        case "richtext": return <FileText className="w-4 h-4" />
        case "color_picker": return <Palette className="w-4 h-4" />
        default: return <Type className="w-4 h-4" />
    }
}

export const inputTypes = [
    { type: "text", label: "Short Text", icon: Type },
    { type: "email", label: "Email", icon: AtSign },
    { type: "phone", label: "Phone Number", icon: Phone },
    { type: "textarea", label: "Long Text", icon: AlignLeft },
    { type: "number", label: "Number", icon: Hash },
    { type: "select", label: "Dropdown", icon: List },
    { type: "radio", label: "Radio Group", icon: CircleDot },
    { type: "checkbox", label: "Checkbox Group", icon: CheckSquare },
    { type: "date", label: "Date Picker", icon: Calendar },
    { type: "date_range", label: "Date Range", icon: CalendarRange },
    { type: "boolean", label: "Yes/No Toggle", icon: ToggleLeft },
    { type: "slider", label: "Range Slider", icon: SlidersHorizontal },
    { type: "star_rating", label: "Star Rating", icon: Star },
    { type: "happiness_rating", label: "Happiness Rating", icon: Smile },
    { type: "condition_block", label: "Condition Block", icon: GitMerge },
    { label: "Group / Step", type: "input_group", icon: Folder },
    { type: "flex_row", label: "Flex Row", icon: Columns },
    { type: "address", label: "Address Group", icon: MapPin },
    { type: "image", label: "Image", icon: ImageIcon },
    { type: "file_upload", label: "File Upload", icon: FileUp },
    { type: "title", label: "Form Title", icon: Heading },
    { type: "subtitle", label: "Subtitle", icon: MessageSquare },
    { type: "separator", label: "Horizontal Rule", icon: Minus },
    { type: "stepper", label: "Stepper", icon: ChevronsUpDown },
    { type: "richtext", label: "Rich Text", icon: FileText },
    { type: "color_picker", label: "Color Palette", icon: Palette },
]
