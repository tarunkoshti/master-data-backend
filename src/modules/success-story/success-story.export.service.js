import exceljs from 'exceljs';
import { successStoryRepository } from './success-story.repository.js';

export const exportSuccessStories = async (filters, query, res) => {
    // 1. Fetch records (bypassing pagination)
    const exportQuery = { ...query };
    delete exportQuery.pagination;
    
    const result = await successStoryRepository.getAllSuccessStories(filters, exportQuery);
    const stories = result.data || [];

    // 2. Create workbook and worksheet
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Success Stories');

    // 3. Define columns according to requested order
    worksheet.columns = [
        { header: 'App ID', key: 'app_package_name', width: 25 },
        { header: 'Profile ID', key: 'profile_id', width: 15 },
        { header: 'Mobile Number', key: 'mobile_number', width: 20 },
        { header: 'Marriage Date', key: 'marriage_date', width: 15, style: { numFmt: 'dd/mm/yyyy' } },
        { header: 'Bride Name & Address', key: 'bride_name_address', width: 40 },
        { header: 'Groom Name & Address', key: 'groom_name_address', width: 40 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Deletion Reason', key: 'deletion_reason', width: 35 },
        { header: 'Time Left', key: 'time_left', width: 15 },
        { header: 'Submitted At', key: 'created_at', width: 20, style: { numFmt: 'dd/mm/yyyy' } },
        { header: 'Deleted At', key: 'deleted_at', width: 15, style: { numFmt: 'dd/mm/yyyy' } }
    ];

    // Style the header row (bold, white text, blue background, center aligned)
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0070C0' } // Blue background
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Auto-filter
    worksheet.autoFilter = {
        from: 'A1',
        to: 'K1',
    };

    const parseDate = (dateString) => {
        if (!dateString) return null;
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return null;
        return d;
    };

    const calculateTimeLeft = (createdAtStr) => {
        if (!createdAtStr) return '-';
        const createdTime = new Date(createdAtStr).getTime();
        const targetTime = createdTime + 48 * 60 * 60 * 1000; // 48 hours
        const now = new Date().getTime();
        const diff = targetTime - now;

        if (diff <= 0) return 'Overdue for deletion';
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    // 4. Add data rows
    stories.forEach(story => {
        const row = worksheet.addRow({
            app_package_name: story.app_package_name || '-',
            profile_id: story.profile_id || '-',
            mobile_number: story.mobile_number || '-',
            marriage_date: parseDate(story.marriage_date),
            bride_name_address: story.bride_name_address || '-',
            groom_name_address: story.groom_name_address || '-',
            status: (story.status || '').toUpperCase(),
            deletion_reason: story.deletion_reason || '-',
            time_left: story.status === 'profile_deleted' ? '-' : calculateTimeLeft(story.created_at),
            created_at: parseDate(story.created_at),
            deleted_at: parseDate(story.deleted_at)
        });

        // Apply color to the Status column (Column G, index 7)
        const statusLower = (story.status || '').toLowerCase();
        let fontColor = 'FF000000'; // Default black
        if (statusLower === 'verified' || statusLower === 'approved') {
            fontColor = 'FF047857'; // emerald-700
        } else if (statusLower === 'rejected' || statusLower === 'profile_deleted') {
            fontColor = 'FFBE123C'; // rose-700
        } else if (statusLower === 'pending') {
            fontColor = 'FFB45309'; // amber-700
        }
        
        if (fontColor !== 'FF000000') {
            row.getCell('status').font = { color: { argb: fontColor }, bold: true };
        }
    });

    // Write to stream
    await workbook.xlsx.write(res);
    res.end();
};

export const successStoryExportService = {
    exportSuccessStories
};
