import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { X } from "lucide-react";


export interface Filters {
    category: string;
    year: number[];
    fileType: string;
    author: string;
    language: string;
}

const categories = [
    'All',
    'Textbooks',
    'Theses',
    'Journals',
    'Case Studies',
    'Research Papers',
    'Conference Proceedings',
].sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b));

const fileTypes = ['All', 'PDF', 'EPUB', 'DOC', 'Video'];

const languages = ['All', 'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];

export function SearchFilter({ onClose }: { onClose?: () => void }) {
    const [filters, setFilters] = useState<Filters>({
        category: 'All',
        year: [1950, 2026],
        fileType: 'All',
        language: 'All',
        author: '',
    });

    const onFilterChange = (newFilters: Filters) => {
        setFilters(newFilters);
    };

    const handleCategoryChange = (category: string) => {
        onFilterChange({ ...filters, category });
    };

    const handleYearChange = (newValue: number[]) => {
        onFilterChange({ ...filters, year: newValue });
    };

    const handleFileTypeChange = (value: string) => {
        onFilterChange({ ...filters, fileType: value });
    };

    const handleAuthorChange = (author: string) => {
        onFilterChange({ ...filters, author });
    };

    const handleLanguageChange = (language: string) => {
        onFilterChange({ ...filters, language });
    };

    return (
        <section className="relative space-y-4 sm:space-y-6 p-4 sm:p-6 max-h-[60vh] sm:max-h-[70vh] lg:max-h-full overflow-auto">
            <div className="flex items-center justify-between sticky top-0 bg-card pb-2">
                <h3 className="text-lg sm:text-xl font-semibold">Filters</h3>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                    className="h-8 w-8 p-0 rounded-full hover:bg-accent hover:text-accent-foreground"
                    aria-label="Close filters"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div>
                <Label className="text-sm font-medium mb-3 block">Category</Label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <Badge
                            key={category}
                            variant={filters.category === category ? "default" : "secondary"}
                            className="cursor-pointer hover:bg-primary/80"
                            onClick={() => handleCategoryChange(category)}
                        >
                            {category}
                        </Badge>
                    ))}
                </div>
            </div>

            <Separator />

            <div>
                <Label className="text-sm font-medium mb-3 block">Publication Year</Label>
                <Slider
                    value={filters.year}
                    onValueChange={handleYearChange}
                    min={1950}
                    max={2026}
                    step={1}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{filters.year[0]}</span>
                    <span>{filters.year[1]}</span>
                </div>
            </div>

            <Separator />

            <div>
                <Label className="text-sm font-medium mb-3 block">File Type</Label>
                <RadioGroup value={filters.fileType} onValueChange={handleFileTypeChange}>
                    {fileTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                            <RadioGroupItem value={type} id={type} />
                            <Label htmlFor={type} className="text-sm cursor-pointer">
                                {type}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <Separator />

            <div>
                <Label className="text-sm font-medium mb-3 block">Author</Label>
                <Input
                    placeholder="Enter author name"
                    value={filters.author}
                    className='rounded-full'
                    onChange={(e) => handleAuthorChange(e.target.value)}
                />
            </div>

            <Separator />

            <div>
                <Label className="text-sm font-medium mb-3 block">Language</Label>
                <Select value={filters.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                                {lang}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={() => {
                        onFilterChange({
                            category: 'All',
                            year: [1950, 2026],
                            fileType: 'All',
                            author: '',
                            language: 'All',
                        });
                    }}
                >
                    Clear All
                </Button>
                <Button className="flex-1 rounded-full" onClick={() => void 0}>
                    Apply
                </Button>
            </div>
        </section>
    );
}
